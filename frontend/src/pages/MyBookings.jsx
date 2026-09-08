import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  Ticket,
  Calendar,
  MapPin,
  Compass,
  CheckCircle2,
  XCircle,
  Loader2,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.get('/bookings/my-bookings');
      setBookings(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs uppercase tracking-wider mb-2">
              Customer Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-sm text-slate-500 mt-1">View and track all your event reservations</p>
          </div>

          <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm self-start md:self-auto">
            <Ticket className="w-5 h-5 text-indigo-600" />
            <div className="text-xs text-slate-600">
              Total Reserved: <strong className="text-slate-900 text-sm font-bold ml-1">{bookings.length} Events</strong>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="w-full rounded-3xl bg-white p-10 md:p-16 border border-slate-200/80 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">No bookings yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
              You haven't reserved tickets for any events. Browse our upcoming events to get started!
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Events</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Event Details</th>
                      <th className="py-4 px-4">Event Date</th>
                      <th className="py-4 px-4">Location</th>
                      <th className="py-4 px-4">Tickets</th>
                      <th className="py-4 px-4 text-right">Total Paid</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Booked On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {bookings.map((booking) => {
                      const event = booking.event || {};
                      const isConfirmed = booking.bookingStatus === 'CONFIRMED';

                      return (
                        <tr key={booking._id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900">{event.title || 'Event Removed'}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Booking Ref: #{booking._id.slice(-6).toUpperCase()}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-slate-800">{formatDate(event.date)}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{event.location || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-900">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                              {booking.ticketsBooked} {booking.ticketsBooked === 1 ? 'Ticket' : 'Tickets'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-slate-900">
                            {formatCurrency(booking.totalAmount)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {isConfirmed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                <XCircle className="w-3.5 h-3.5" />
                                Cancelled
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right text-xs text-slate-500">
                            {formatDate(booking.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {bookings.map((booking) => {
                const event = booking.event || {};
                const isConfirmed = booking.bookingStatus === 'CONFIRMED';

                return (
                  <div key={booking._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Ref: #{booking._id.slice(-6).toUpperCase()}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{event.title || 'Event Removed'}</h3>
                      </div>
                      {isConfirmed ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          Confirmed
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Cancelled
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 block">Date</span>
                        <span className="font-semibold text-slate-800">{formatDate(event.date)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Location</span>
                        <span className="font-semibold text-slate-800 truncate block">{event.location || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Tickets</span>
                        <span className="font-semibold text-slate-800">{booking.ticketsBooked} Reserved</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Paid</span>
                        <span className="font-bold text-indigo-600">{formatCurrency(booking.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default MyBookings;