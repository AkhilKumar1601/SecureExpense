import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar component
import Dashboard from './pages/Dashboard'; // Import Dashboard page
import Login from './pages/auth/Login'; // Import Login page
import Register from './pages/auth/Register'; // Import Register page
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute to protect routes
import Reports from './pages/Reports'; // Import Reports page
import Budget from './pages/Budget'; // Import Budget page
import Expenses from './pages/Expenses'; // Import Expenses page
import PasswordRecovery from './pages/auth/PasswordRecovery'; // Import PasswordRecovery page

const RoutesComponent: React.FC = () => {

  return (
    <Router>
      <Navbar /> {/* Navbar will be displayed across all pages */}
      <div className="container mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Expenses />
              </PrivateRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <PrivateRoute>
                <Budget />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default RoutesComponent;

