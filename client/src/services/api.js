import axios from 'axios';

// You can set REACT_APP_API_BASE_URL in your .env file, or fallback to relative path
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always include cookies for auth if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export { apiClient };
export default apiClient;
