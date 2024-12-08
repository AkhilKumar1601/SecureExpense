import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold">Expense Dashboard</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Expense
      </button>
      {/* Expense Table */}
      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Notes</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense: any) => (
            <tr key={expense._id}>
              <td className="p-2 border">{expense.date}</td>
              <td className="p-2 border">{expense.category}</td>
              <td className="p-2 border">${expense.amount}</td>
              <td className="p-2 border">{expense.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2>Add/Edit Expense</h2>
            {/* Add your form here */}
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
