import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

// @desc    Get all upcoming events (with category and search filters)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    // Category filter
    if (category && category.trim() !== '') {
      filter.category = category.trim();
    }

    // Search filter (searches title, description, or location)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ date: 1 }); // Sort upcoming first

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer only)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      imageUrl,
      date,
      location,
      ticketPrice,
      totalTickets,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !location ||
      ticketPrice === undefined ||
      !totalTickets
    ) {
      res.status(400);
      throw new Error('Please provide all required event details');
    }

    if (Number(totalTickets) < 1) {
      res.status(400);
      throw new Error('Total tickets must be at least 1');
    }

    if (Number(ticketPrice) < 0) {
      res.status(400);
      throw new Error('Ticket price cannot be negative');
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      res.status(400);
      throw new Error('Please provide a valid date format');
    }

    // availableTickets defaults to totalTickets upon creation
    const event = await Event.create({
      title,
      description,
      category,
      imageUrl: imageUrl ? imageUrl.trim() : '',
      date: eventDate,
      location,
      ticketPrice: Number(ticketPrice),
      totalTickets: Number(totalTickets),
      availableTickets: Number(totalTickets),
      organizer: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch all events created by logged-in organizer with sales summary
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer only)
export const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });

    // Calculate sales summary per event
    const eventsWithSummary = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({
          event: event._id,
          bookingStatus: 'CONFIRMED',
        });

        const ticketsSold = event.totalTickets - event.availableTickets;
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

        return {
          ...event.toObject(),
          ticketsSold,
          totalRevenue,
          bookingCount: bookings.length,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: eventsWithSummary.length,
      data: eventsWithSummary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch list of customers who booked tickets for a specific event
// @route   GET /api/events/:id/attendees
// @access  Private (Organizer only)
export const getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    // Ensure the requester is the event owner
    if (event.organizer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view attendees for this event');
    }

    const attendees = await Booking.find({
      event: req.params.id,
      bookingStatus: 'CONFIRMED',
    })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attendees.length,
      eventTitle: event.title,
      data: attendees,
    });
  } catch (error) {
    next(error);
  }
};