import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/login', form);
      setMessage('Login successful!');
      window.location.href = '/dashboard';
    } catch (error) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Error occurred');
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" value={form.email} onChange={handleInputChange} placeholder="Email" required />
        <input name="password" value={form.password} onChange={handleInputChange} placeholder="Password" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
