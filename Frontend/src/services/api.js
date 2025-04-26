import axios from 'axios';

const backUrl = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: backUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded', // Form Data for login
  },
});

// Helper to convert object to URL-encoded form for login
const toFormData = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

// Login function using form data
export const login = (data) => API.post('/auth/login', toFormData(data));

// Signup function using JSON format
export const signup = (data) => API.post('/auth/signup', data, {
  headers: { 'Content-Type': 'application/json' } // JSON format for signup
});

export const verifyEmail = (token) => API.get(`/auth/verify-email?token=${token}`);
