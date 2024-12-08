// src/pages/Expenses.tsx
import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import api from '../services/api'; // Assuming you have an API service for fetching data

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
  });

  // Fetch expenses from backend
  const fetchExpenses = async (page: number = 1) => {
    try {
      const response = await api.get(`/expenses?page=${page}&category=${filters.category}&date=${filters.date}`);
      setExpenses(response.data.expenses); // Assuming backend returns a list of expenses
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(); // Fetch expenses on initial render
  }, [filters]);

  // Handle sorting, filtering, and pagination
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, date: e.target.value }));
  };

  const downloadCSV = () => {
    // Prepare data for CSV export
    const csvData = [
      ['Date', 'Category', 'Amount', 'Note'],
      ...expenses.map((expense) => [
        expense.date,
        expense.category,
        expense.amount,
        expense.note,
      ]),
    ];
    return csvData;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Expenses</h1>

      {/* Filter Options */}
      <div className="flex space-x-4 mb-4">
        <select onChange={handleCategoryChange} className="border rounded p-2">
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Travel">Travel</option>
          {/* Add more categories */}
        </select>

        <select onChange={handleDateChange} className="border rounded p-2">
          <option value="">All Dates</option>
          <option value="last30days">Last 30 Days</option>
          <option value="thisYear">This Year</option>
          {/* Add more date filters */}
        </select>
      </div>

      {loading ? (
        <div>Loading expenses...</div>
      ) : (
        <div>
          {/* Table for displaying expenses */}
          <table className="min-w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="border p-2">{expense.date}</td>
                  <td className="border p-2">{expense.category}</td>
                  <td className="border p-2">{expense.amount}</td>
                  <td className="border p-2">{expense.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Buttons */}
          <div className="mt-4">
            {/* Pagination controls */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => fetchExpenses(1)}
            >
              Previous
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => fetchExpenses(2)} // Update for page 2, etc.
            >
              Next
            </button>
          </div>

          {/* CSV Download Button */}
          <CSVLink data={downloadCSV()} filename="expenses.csv" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Download CSV
          </CSVLink>
        </div>
      )}
    </div>
  );
};

export default Expenses;
