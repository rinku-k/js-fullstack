import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy will handle forwarding to localhost:5001
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
