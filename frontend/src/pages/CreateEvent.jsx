import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import {
  Calendar,
  MapPin,
  Ticket,
  ChevronDown,
  Info,
  Loader2,
  Sparkles,
  ArrowLeft,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Music', 'Tech', 'Workshop', 'Sports', 'Other'];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    date: '',
    location: '',
    ticketPrice: '',
    totalTickets: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.date ||
      !formData.location.trim() ||
      formData.ticketPrice === '' ||
      formData.totalTickets === ''
    ) {
      return toast.error('Please fill in all required fields');
    }

    if (Number(formData.ticketPrice) < 0) {
      return toast.error('Ticket price cannot be negative');
    }

    if (Number(formData.totalTickets) < 1) {
      return toast.error('Total tickets must be at least 1');
    }

    const eventDate = new Date(formData.date);
    if (isNaN(eventDate.getTime())) {
      return toast.error('Please provide a valid date');
    }

    try {
      setIsSubmitting(true);
      await API.post('/events', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        imageUrl: formData.imageUrl.trim(),
        date: eventDate.toISOString(),
        location: formData.location.trim(),
        ticketPrice: Number(formData.ticketPrice),
        totalTickets: Number(formData.totalTickets),
      });

      toast.success('Event created and published successfully!');
      navigate('/organizer/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create event. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link to="/organizer/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-indigo-600 font-semibold">Create Event</span>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Event
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the event details, schedule, and ticket inventory to launch your listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Event Information */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Event Information</h2>
                <p className="text-xs text-slate-500">Basic identification and public details for your listing</p>
              </div>
            </div>

            {/* Event Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Event Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. NextGen Web Conference 2025"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide an overview of the agenda, speakers, or highlights..."
                required
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition resize-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition cursor-pointer"
                >
                  <option value="" disabled>Select a primary category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Optional Image URL Input */}
            <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Cover Image URL <span className="text-xs font-normal text-slate-400 lowercase">(optional)</span>
                </label>
                <span className="text-[11px] text-slate-400">Leave blank for automatic category cover</span>
            </div>
            <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/your-custom-image.jpg"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
            />
            </div>
          </div>

          {/* Section 2: Schedule & Location */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Schedule & Location</h2>
                <p className="text-xs text-slate-500">Specify when and where attendees will gather</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Moscone Center, San Francisco or Online"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Ticket Pricing & Inventory */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Ticket Information</h2>
                <p className="text-xs text-slate-500">Configure ticket pricing and maximum capacity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Ticket Price */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Ticket Price ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                    $
                  </div>
                  <input
                    type="number"
                    name="ticketPrice"
                    min="0"
                    step="1"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    placeholder="e.g. 150 (0 for Free)"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Total Capacity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Total Ticket Capacity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalTickets"
                  min="1"
                  step="1"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Dynamic Notice Banner */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-900 leading-relaxed">
                <strong className="font-semibold text-indigo-950">Concurrency Protected:</strong> Initial available tickets will automatically equal total ticket capacity ({formData.totalTickets || 0}) and decrement atomically as customers reserve slots.
              </p>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/organizer/dashboard')}
              className="px-6 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200/60 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[160px] py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Event...</span>
                </>
              ) : (
                <span>Publish Event</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateEvent;