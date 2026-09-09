import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

// @desc    Book tickets for an event (Concurrency-safe atomic update)
// @route   POST /api/events/:id/book
// @access  Private (Customer only)
export const bookTickets = async (req, res, next) => {
  try {
    const { tickets } = req.body;
    const eventId = req.params.id;
    const requestedTickets = Number(tickets);

    if (!requestedTickets || requestedTickets < 1) {
      res.status(400);
      throw new Error('Please specify a valid number of tickets (min 1)');
    }

    // 1. ATOMIC OPERATION: Decrement availableTickets ONLY if availableTickets >= requestedTickets AND date is in the future
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        availableTickets: { $gte: requestedTickets },
        date: { $gte: new Date() }, // Prevents booking expired events
      },
      {
        $inc: { availableTickets: -requestedTickets },
      },
      { new: true }
    );

    // If null, either event doesn't exist OR not enough tickets are remaining
    if (!updatedEvent) {
      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        res.status(404);
        throw new Error('Event not found');
      }

      if (new Date(eventExists.date) <= new Date()) {
        res.status(400);
        throw new Error('Cannot book tickets for an event that has already ended');
      }

      res.status(400);
      throw new Error(
        `Sold Out / Insufficient tickets. Only ${eventExists.availableTickets} tickets remaining.`
      );
    }

    // 2. Create the Booking Record
    const totalAmount = updatedEvent.ticketPrice * requestedTickets;

    const booking = await Booking.create({
      customer: req.user._id,
      event: eventId,
      ticketsBooked: requestedTickets,
      totalAmount,
      bookingStatus: 'CONFIRMED',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title date location ticketPrice')
      .populate('customer', 'name email');

    res.status(201).json({
      success: true,
      message: `Successfully booked ${requestedTickets} ticket(s)!`,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for logged-in customer
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer only)
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate({
        path: 'event',
        select: 'title description category date location ticketPrice organizer',
        populate: {
          path: 'organizer',
          select: 'name email',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};