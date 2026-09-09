import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        {/* Copyright */}
        <span>
          © {new Date().getFullYear()} EventScale Multi-Vendor Ticketing Infrastructure. All rights reserved.
        </span>

        {/* Links */}
        <div className="flex items-center space-x-6 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">
            Browse Events
          </Link>
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 transition">
            Privacy
          </a>
          <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 transition">
            Support
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;