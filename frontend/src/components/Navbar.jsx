import React, { useState, useEffect  } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  PlusCircle,
  Calendar,
  BookmarkCheck,
  Compass,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isOrganizer, isCustomer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock background scroll on mobile when menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center">
              <img
                src="/logo.png"
                alt="EventScale"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation Links (Hidden on Mobile) */}
            <div className="hidden md:flex items-center ml-8 space-x-2">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                  isActive('/')
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Browse Events
              </Link>

              {isCustomer && (
                <Link
                  to="/my-bookings"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                    isActive('/my-bookings')
                      ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>
              )}

              {isOrganizer && (
                <>
                  <Link
                    to="/organizer/dashboard"
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                      isActive('/organizer/dashboard')
                        ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Listed Events</span>
                  </Link>
                  <Link
                    to="/organizer/create-event"
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Event</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop User Info & Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold self-end uppercase">
                    {user?.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-rose-600 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
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

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center md:hidden space-x-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-fade-in">
          {isAuthenticated && (
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 mb-2">
              <div>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold uppercase">
                {user?.role}
              </span>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Browse Events</span>
            </Link>

            {isCustomer && (
              <Link
                to="/my-bookings"
                onClick={closeMobileMenu}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive('/my-bookings')
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>My Bookings</span>
              </Link>
            )}

            {isOrganizer && (
              <>
                <Link
                  to="/organizer/dashboard"
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive('/organizer/dashboard')
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Listed Events</span>
                </Link>
                <Link
                  to="/organizer/create-event"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Event</span>
                </Link>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="w-full text-center py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;