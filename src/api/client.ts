import axios from 'axios';

// Ensure API base URL includes /api
const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
        // Handle potential double slash if url ended with /
        url = url.replace('//api', '/api');
    }
    return url;
};

const apiClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
