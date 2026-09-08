import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: {
        values: ['Music', 'Tech', 'Workshop', 'Sports', 'Other'],
        message: '{VALUE} is not a supported category',
      },
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
    },
    totalTickets: {
      type: Number,
      required: [true, 'Total tickets capacity is required'],
      min: [1, 'Total tickets must be at least 1'],
    },
    availableTickets: {
      type: Number,
      required: [true, 'Available tickets count is required'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event must belong to an organizer'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search optimization (?search and ?category)
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ category: 1, date: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;