import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import AttendeeModal from '../components/AttendeeModal';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  Calendar,
  Ticket,
  Layers,
  DollarSign,
  Plus,
  ArrowRight,
  Users,
  Loader2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);

  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);
      const response = await API.get('/events/organizer/my-events');
      setEvents(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to load organizer dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  // Aggregated Metrics
  const totalEvents = events.length;
  const totalTicketsSold = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
  const totalRemainingTickets = events.reduce((sum, e) => sum + (e.availableTickets || 0), 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.totalRevenue || 0), 0);

  const handleOpenAttendees = (event) => {
    setSelectedEventForAttendees(event);
    setIsAttendeeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Ribbon & Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Organizer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Monitor event capacity, ticket sales, and attendee registrations in real-time.
            </p>
          </div>

          <Link
            to="/organizer/create-event"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all self-start sm:self-auto active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Metric Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Events */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Events
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalEvents}
            </div>
          </div>

          {/* Tickets Sold */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tickets Sold
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalTicketsSold.toLocaleString()}
            </div>
          </div>

          {/* Remaining Tickets */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Remaining Tickets
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalRemainingTickets.toLocaleString()}
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
        </section>

        {/* My Events Table Section */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Events</h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 tracking-wide">
              {events.length} ACTIVE {events.length === 1 ? 'LISTING' : 'LISTINGS'}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No events listed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first event to start accepting ticket reservations and monitoring live attendee rosters.
              </p>
              <Link
                to="/organizer/create-event"
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Event</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      <th className="py-4 px-6">Event Title</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-4">Location</th>
                      <th className="py-4 px-4 text-right">Capacity</th>
                      <th className="py-4 px-4 text-right">Sold</th>
                      <th className="py-4 px-4 text-right">Remaining</th>
                      <th className="py-4 px-4 text-right">Revenue</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                    {events.map((event) => (
                      <tr key={event._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          {event.title}
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                            {event.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600">
                          {formatDate(event.date)}
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600 truncate max-w-[150px]">
                          {event.location}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-slate-900">
                          {event.totalTickets}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-indigo-600">
                          {event.ticketsSold || 0}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-slate-600">
                          {event.availableTickets}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-slate-900">
                          {formatCurrency(event.totalRevenue || 0)}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenAttendees(event)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>View Attendees</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Cards View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-indigo-700 border border-slate-200">
                          {event.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{event.title}</h3>
                        <p className="text-xs text-slate-500">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Sold</span>
                        <span className="font-bold text-indigo-600">{event.ticketsSold || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Left</span>
                        <span className="font-bold text-slate-700">{event.availableTickets}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Revenue</span>
                        <span className="font-bold text-slate-900">{formatCurrency(event.totalRevenue || 0)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAttendees(event)}
                      className="w-full py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>View Attendees ({event.ticketsSold || 0})</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Create Flow Banner */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create new ticketing flows</h3>
              <p className="text-xs text-slate-500">
                Launch events, set ticket quotas, and enforce atomic capacity limits instantly.
              </p>
            </div>
          </div>
          <Link
            to="/organizer/create-event"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition whitespace-nowrap"
          >
            <span>Create Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

      </div>

      {/* Attendee List Modal */}
      <AttendeeModal
        eventId={selectedEventForAttendees?._id}
        eventTitle={selectedEventForAttendees?.title}
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
      />

    </div>
  );
};

export default OrganizerDashboard;