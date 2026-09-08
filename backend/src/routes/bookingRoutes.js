import express from 'express';
import { getMyBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer bookings route
router.get('/my-bookings', protect, authorize('CUSTOMER'), getMyBookings);

export default router;