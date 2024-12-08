import React, { useState } from 'react';
import axios from 'axios';

const Register: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      await axios.post('/api/users/register', form);
      setMessage('Registration successful!');
    } catch (error) {
      // Type assertion for AxiosError
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Error occurred');
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg">
      <h1 className="text-xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleInputChange} placeholder="Email" required />
        <input name="password" value={form.password} onChange={handleInputChange} placeholder="Password" required />
        <input name="confirmPassword" value={form.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
