import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here if needed in the future
// axiosClient.interceptors.request.use(...)

export default axiosClient;
