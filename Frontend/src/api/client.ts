import axios from 'axios';

// In production (Vercel), use relative path. In development, use localhost
const API_BASE = import.meta.env.VITE_API_BASE ||
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:4000/api');

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

export default client;