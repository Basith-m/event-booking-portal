import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import BookingModal from '../components/BookingModal';
import { formatDate, formatCurrency, getEventImage } from '../utils/formatters';
import {
  Search,
  X,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Ticket,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Music', 'Tech', 'Workshop', 'Sports', 'Other'];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated, isOrganizer } = useAuth();
  const navigate = useNavigate();

  // Fetch events with category & search parameters
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await API.get('/events', { params });
      setEvents(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchQuery]);

  const handleOpenBooking = (event) => {
    if (!isAuthenticated) {
      toast('Please log in as a Customer to book tickets', { icon: '🔒' });
      return navigate('/login');
    }
    if (isOrganizer) {
      return toast.error('Organizers cannot book tickets. Please use a Customer account.');
    }
    if (event.availableTickets <= 0) {
      return toast.error('Sorry, this event is completely sold out.');
    }

    setSelectedEventForBooking(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero & Search Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Multi-Vendor Ticketing Infrastructure
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Discover Your Next Event
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Explore and book tickets for upcoming conferences, workshops, concerts, and tech gatherings with real-time seat reservation.
          </p>
        </div>

        {/* Search Bar & Categories Row */}
        <div className="mt-8 space-y-4">
          <div className="relative max-w-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200/80 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/20 transition">
              <Search className="w-5 h-5 text-slate-400 ml-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, keyword, or venue..."
                className="w-full h-12 bg-transparent pl-3 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-slate-200'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Available Experiences</h2>
            <span className="text-xs font-medium text-slate-500">
              ({events.length} {events.length === 1 ? 'result' : 'curated results'})
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-500">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Live Inventory Sync</span>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 animate-pulse space-y-4">
                <div className="h-44 bg-slate-200 rounded-2xl w-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Empty Search Results */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No events found</h3>
            <p className="text-sm text-slate-500">
              We couldn't find any events matching your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isSoldOut = event.availableTickets <= 0;
              const isLowStock = event.availableTickets > 0 && event.availableTickets <= 15;

              return (
                <article
                  key={event._id}
                  className={`group bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between ${
                    isSoldOut ? 'opacity-85' : ''
                  }`}
                >
                  {/* Event Top Banner Image */}
                  <div>
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                      <img
                        src={getEventImage(event)}
                        alt={event.title}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isSoldOut ? 'grayscale contrast-75' : 'group-hover:scale-105'
                        }`}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-indigo-700 shadow-sm backdrop-blur-sm">
                          {event.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        {isSoldOut ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-sm">
                            Sold Out
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm flex items-center gap-1 animate-pulse">
                            {event.availableTickets} left
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                            {event.availableTickets} left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Metadata */}
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="pt-2 space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="text-slate-700 font-medium">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Button Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 uppercase">
                        Per Ticket
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isSoldOut ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                      >
                        {formatCurrency(event.ticketPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => handleOpenBooking(event)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-sm ${
                        isSoldOut
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]'
                      }`}
                    >
                      <span>{isSoldOut ? 'Sold Out' : 'Book Tickets'}</span>
                      {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <BookingModal
        event={selectedEventForBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchEvents()}
      />

    </div>
  );
};

export default Home;