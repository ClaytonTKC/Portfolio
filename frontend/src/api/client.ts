import axios from 'axios';
import { eventBus } from '../utils/eventBus';
import { getApiBaseUrl } from './url';

// Create axios instance with base URL from environment variables
const client = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token if available
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized - clear token
            if (error.response.status === 401) {
                localStorage.removeItem('admin_token');
                // Optional: Redirect to login if not already there
                eventBus.emit('auth:session-expired');
            }
        }
        return Promise.reject(error);
    }
);

export default client;
