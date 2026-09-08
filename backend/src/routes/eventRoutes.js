import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  getOrganizerEvents,
  getEventAttendees,
} from '../controllers/eventController.js';
import { bookTickets } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);

// Organizer specific routes (must be defined before /:id)
router.get('/organizer/my-events', protect, authorize('ORGANIZER'), getOrganizerEvents);

// Public single event
router.get('/:id', getEventById);

// Organizer actions
router.post('/', protect, authorize('ORGANIZER'), createEvent);
router.get('/:id/attendees', protect, authorize('ORGANIZER'), getEventAttendees);

// Customer actions on events
router.post('/:id/book', protect, authorize('CUSTOMER'), bookTickets);

export default router;