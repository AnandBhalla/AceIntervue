import axios from 'axios';

const backUrl = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: backUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

const toFormData = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

export const login = (data) => API.post('/auth/login', toFormData(data));

export const signup = (data) =>
  API.post('/auth/signup', data, {
    headers: { 'Content-Type': 'application/json' },
  });

export const verifyEmail = (token) => API.get(`/auth/verify-email?token=${token}`);

export const resendVerification = (email) =>
  API.post('/auth/resend-verification', null, {
    params: { email },
  });

export const getCurrentUser = (token) =>
  API.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getDomains = () => API.get('/domain/');