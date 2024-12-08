// src/services/api.ts
import axios from 'axios';

// Define your base URL (Make sure to replace it with the actual backend URL)
const API_URL = 'http://localhost:5000';

// Create an axios instance for API requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function to handle token storage
const getAuthToken = () => {
  // Get JWT token from HttpOnly cookies or localStorage
  // Replace with actual implementation
  return localStorage.getItem('accessToken') || '';
};

// Intercept requests to add the token in headers (if authenticated)
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Authentication APIs

// Register user
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data; // Returns user info or success message
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data; // Returns JWT tokens (accessToken, refreshToken)
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Request OTP for password recovery
export const requestOTP = async (email: string) => {
  try {
    const response = await api.post('/users/request-otp', { email });
    return response.data; // Success message
  } catch (error) {
    console.error('Error requesting OTP:', error);
    throw error;
  }
};

// Reset password with OTP
export const resetPassword = async (otp: string, newPassword: string) => {
  try {
    const response = await api.post('/users/reset-password', { otp, newPassword });
    return response.data; // Success message
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Expense Management APIs

// Fetch expenses with pagination and filters (category, date, etc.)
export const fetchExpenses = async (page: number = 1, filters: { category?: string; date?: string }) => {
  try {
    const response = await api.get('/expenses', {
      params: { page, ...filters },
    });
    return response.data; // Returns expenses data with pagination
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

// Add a new expense
export const addExpense = async (expenseData: { amount: number; category: string; note: string; date: string }) => {
  try {
    const response = await api.post('/expenses', expenseData);
    return response.data; // Returns newly created expense data
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

// Edit an existing expense
export const editExpense = async (expenseId: string, expenseData: { amount: number; category: string; note: string; date: string }) => {
  try {
    const response = await api.put(`/expenses/${expenseId}`, expenseData);
    return response.data; // Returns updated expense data
  } catch (error) {
    console.error('Error editing expense:', error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (expenseId: string) => {
  try {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data; // Success or confirmation message
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Budget Management APIs

// Set or update the user's monthly budget
export const setBudget = async (budgetAmount: number) => {
  try {
    const response = await api.put('/users/budget', { budgetAmount });
    return response.data; // Returns updated budget info
  } catch (error) {
    console.error('Error setting budget:', error);
    throw error;
  }
};

// Fetch the user's current budget and usage
export const getBudget = async () => {
  try {
    const response = await api.get('/users/budget');
    return response.data; // Returns budget details (set budget, usage)
  } catch (error) {
    console.error('Error fetching budget:', error);
    throw error;
  }
};

// Reporting & Analytics APIs

// Fetch monthly and yearly expense reports
export const fetchReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data; // Returns monthly and yearly reports data
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export default api;
