import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Pages (will be created in Milestones 5, 6, 7)
const Placeholder = ({ title }) => (
  <div className="max-w-7xl mx-auto px-4 py-12 text-center">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="mt-2 text-gray-600">This view will be linked in the next milestone.</p>
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Placeholder title="Event Discovery Feed (Milestone 6)" />} />
          <Route path="/login" element={<Placeholder title="Login Page (Milestone 5)" />} />
          <Route path="/register" element={<Placeholder title="Register Page (Milestone 5)" />} />

          {/* Customer Protected Routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <Placeholder title="Customer Bookings (Milestone 6)" />
              </ProtectedRoute>
            }
          />

          {/* Organizer Protected Routes */}
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER']}>
                <Placeholder title="Organizer Dashboard (Milestone 7)" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/create-event"
            element={
              <ProtectedRoute allowedRoles={['ORGANIZER']}>
                <Placeholder title="Create Event Form (Milestone 7)" />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;