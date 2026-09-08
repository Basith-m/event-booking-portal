import React, { useState, useEffect  } from 'react';
import { X, Calendar, MapPin, Plus, Minus, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDate, formatCurrency, getEventImage } from '../utils/formatters';
import API from '../api/axios';
import toast from 'react-hot-toast';

const BookingModal = ({ event, isOpen, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const maxTickets = Math.min(10, event.availableTickets);
  const totalAmount = quantity * event.ticketPrice;
  const isSoldOut = event.availableTickets <= 0;

  const handleAdjustQuantity = (delta) => {
    const next = quantity + delta;
    if (next >= 1 && next <= maxTickets) {
      setQuantity(next);
    }
  };

  const handleBooking = async () => {
    if (isSoldOut) {
      return toast.error('This event is sold out');
    }

    try {
      setIsSubmitting(true);
      const response = await API.post(`/events/${event._id}/book`, {
        tickets: quantity,
      });

      setBookingSuccess(true);
      toast.success(response.data?.message || `Booked ${quantity} ticket(s) successfully!`);

      setTimeout(() => {
        setBookingSuccess(false);
        setIsSubmitting(false);
        onSuccess();
        onClose();
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      const msg = error.response?.data?.message || 'Failed to book tickets. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Modal Container with Max Viewport Height and Internal Scroll */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden border border-slate-100 my-auto animate-scale-in">
        
        {/* Modal Banner Header (Compact & Responsive) */}
        <div className="relative w-full h-28 sm:h-36 shrink-0 overflow-hidden bg-slate-900">
          <img
            src={getEventImage(event)}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-indigo-700 shadow-sm">
              {event.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-sm">
              {event.availableTickets > 0 ? `${event.availableTickets} tickets left` : 'Sold Out'}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Direct Checkout
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 line-clamp-2">
              Book Tickets - {event.title}
            </h2>
          </div>

          {/* Event Details Ribbon */}
          <div className="p-3 sm:p-3.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-medium text-slate-900">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Stepper & Pricing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 block">Select Quantity</span>
                <span className="text-[11px] sm:text-xs text-slate-500">
                  Unit Price: <strong className="text-slate-800">{formatCurrency(event.ticketPrice)}</strong>
                </span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center bg-slate-100 rounded-xl p-0.5 sm:p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleAdjustQuantity(-1)}
                  disabled={quantity <= 1 || isSoldOut}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white transition disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-bold text-slate-900 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleAdjustQuantity(1)}
                  disabled={quantity >= maxTickets || isSoldOut}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white transition disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-indigo-50/70 border border-indigo-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Order Summary</span>
              <div className="text-right">
                <span className="block text-[10px] sm:text-[11px] text-slate-500">Total Payable</span>
                <span className="text-xl sm:text-2xl font-extrabold text-indigo-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBooking}
              disabled={isSubmitting || isSoldOut}
              className={`min-w-[140px] sm:min-w-[160px] py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all flex items-center justify-center space-x-2 shadow-md ${
                bookingSuccess
                  ? 'bg-emerald-600 shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 disabled:opacity-50'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing...</span>
                </>
              ) : bookingSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmed!</span>
                </>
              ) : (
                <span>{isSoldOut ? 'Sold Out' : 'Confirm Booking'}</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingModal;