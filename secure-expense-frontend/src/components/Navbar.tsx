// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  // Check if a user is logged in (for example, using JWT token)
  useEffect(() => {
    const userData = localStorage.getItem('user'); // Or check cookie/JWT token
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          <Link to="/" className="hover:text-gray-400">
            SecureExpense
          </Link>
        </div>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link to="/expenses" className="hover:text-gray-400">
            Expenses
          </Link>
          <Link to="/budget" className="hover:text-gray-400">
            Budget
          </Link>
          <Link to="/reports" className="hover:text-gray-400">
            Reports
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span>{user.name}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-gray-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-400">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
