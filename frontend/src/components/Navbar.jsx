import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, Calendar, BookmarkCheck } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isOrganizer, isCustomer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="EventScale"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>

            {/* Navigation links based on role */}
            <div className="hidden md:flex items-center ml-8 space-x-2">
              <Link
                to="/"
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition"
              >
                Browse Events
              </Link>

              {isCustomer && (
                <Link
                  to="/my-bookings"
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition"
                >
                  <BookmarkCheck className="h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
              )}

              {isOrganizer && (
                <>
                  <Link
                    to="/organizer/dashboard"
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>My Listed Events</span>
                  </Link>
                  <Link
                    to="/organizer/create-event"
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Event</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Profile & Auth buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold self-end">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-rose-600 transition"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;