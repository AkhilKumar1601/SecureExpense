import React, { useState } from 'react';
import axios from 'axios';

const PasswordRecovery: React.FC = () => {
  const [step, setStep] = useState(1); // Tracks the step of the workflow
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestOtp = async () => {
    try {
      await axios.post('/api/users/request-otp', { email });
      setMessage('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Error occurred');
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('/api/users/reset-password', { email, otp, newPassword });
      setMessage('Password reset successfully!');
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
      <h1 className="text-xl font-bold">Password Recovery</h1>
      {step === 1 ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            onClick={handleRequestOtp}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Request OTP
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded mt-2"
            required
          />
          <button
            onClick={handleResetPassword}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Reset Password
          </button>
        </div>
      )}
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default PasswordRecovery;
