import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Budget: React.FC = () => {
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    const response = await axios.get('/api/users/budget');
    setBudget(response.data.budget);
    setSpent(response.data.spent);
  };

  const handleBudgetUpdate = async () => {
    await axios.post('/api/users/budget', { budget });
    alert('Budget updated!');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold">Budget Management</h1>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(+e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button onClick={handleBudgetUpdate} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Update Budget
      </button>
      <div className="mt-6">
        <p>Spent: ${spent} / ${budget}</p>
        <div className="w-full bg-gray-200 rounded h-4">
          <div
            className={`h-4 rounded ${
              (spent / budget) > 0.75 ? 'bg-red-500' : (spent / budget) > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(spent / budget) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
