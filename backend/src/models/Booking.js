import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must be associated with a customer'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Booking must be associated with an event'],
    },
    ticketsBooked: {
      type: Number,
      required: [true, 'Number of tickets is required'],
      min: [1, 'Must book at least 1 ticket'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    bookingStatus: {
      type: String,
      enum: {
        values: ['CONFIRMED', 'CANCELLED'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'CONFIRMED',
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for customer booking queries
bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ event: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;