import React, { useState, useEffect } from 'react';
import { X, Users, Radio, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AttendeeModal = ({ eventId, eventTitle, isOpen, onClose }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fetch attendees when modal opens
  useEffect(() => {
    if (isOpen && eventId) {
      const fetchAttendees = async () => {
        try {
          setLoading(true);
          const response = await API.get(`/events/${eventId}/attendees`);
          setAttendees(response.data?.data || []);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load attendees');
        } finally {
          setLoading(false);
        }
      };
      fetchAttendees();
    }
  }, [isOpen, eventId]);

  if (!isOpen) return null;

  const totalTicketsBooked = attendees.reduce((sum, a) => sum + a.ticketsBooked, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-scale-in">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Attendees — {eventTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registration rosters and verified credential allocations
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Stat Ribbon */}
        <div className="px-5 sm:px-6 py-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">
            Total Attendees: {attendees.length} customers ({totalTicketsBooked} tickets)
          </span>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Real-time database sync</span>
          </div>
        </div>

        {/* Content Body / Attendees List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : attendees.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Users className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-medium text-sm text-slate-700">No tickets booked yet</p>
              <p className="text-xs text-slate-400">
                When customers reserve tickets for this event, their details will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 px-3">Customer Name</th>
                    <th className="pb-3 px-3">Email</th>
                    <th className="pb-3 px-3 text-center">Tickets</th>
                    <th className="pb-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
                  {attendees.map((booking) => {
                    const customer = booking.customer || {};
                    return (
                      <tr key={booking._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          {customer.name || 'Anonymous User'}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{customer.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                            {booking.ticketsBooked}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-sm transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default AttendeeModal;