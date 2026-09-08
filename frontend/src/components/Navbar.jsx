import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, LogOut, PlusCircle, Calendar, BookmarkCheck, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isOrganizer, isCustomer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Main Link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
              <Ticket className="h-7 w-7" />
              <span className="tracking-tight text-gray-900 font-extrabold">Event<span className="text-indigo-600">Hub</span></span>
            </Link>

            {/* Navigation links based on role */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition"
              >
                Browse Events
              </Link>

              {isCustomer && (
                <Link
                  to="/my-bookings"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition"
                >
                  <BookmarkCheck className="h-4 w-4" />
                  <span>My Bookings</span>
                </Link>
              )}

              {isOrganizer && (
                <>
                  <Link
                    to="/organizer/dashboard"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>My Listed Events</span>
                  </Link>
                  <Link
                    to="/organizer/create-event"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
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
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium self-end">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition focus:outline-none"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-gray-500" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition"
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