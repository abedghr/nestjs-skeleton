import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with minimal default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Only add Authorization header for non-login requests
    if (!config.url.includes('/auth/login')) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const cleanToken = token.replace('Bearer ', '').trim();
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
    
    // Set Content-Type only if not already set (for FormData uploads)
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => {
    console.log('Login payload:', credentials);
    return api.post('/public/auth/login', {
      username: credentials.username,
      password: credentials.password,
      source: credentials.source || 'DASHBOARD'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  register: (userData) => api.post('/public/auth/register', userData),
  refreshToken: (refreshToken) => api.post('/public/auth/refresh', { refreshToken }),
};

// Messaging API
export const messagingAPI = {
  // Conversations
  getConversations: (params) => api.get('/messaging/conversations', { params })
    .then(response => {
      // Ensure we always return an array for conversations
      if (response.data && response.data.data === undefined) {
        response.data.data = [];
      }
      
      return response;
    }),
  createConversation: (data) => api.post('/messaging/conversations', data),
  getConversation: (id) => api.get(`/messaging/conversations/${id}`),
  
  // Messages
  getMessages: (conversationId, params) => 
    api.get(`/messaging/conversations/${conversationId}/messages`, { params })
      .then(response => {
        // Ensure we always return an array for messages
        if (response.data && response.data.data === undefined) {
          response.data.data = [];
        }
        return response;
      })
      .catch(error => {
        // If it's a 403 error (user not participant), return empty messages
        if (error.response?.status === 403) {
          console.log('User not participant in conversation, returning empty messages');
          return { data: { data: [] } };
        }
        throw error;
      }),
  sendMessage: (conversationId, data) => 
    api.post(`/messaging/conversations/${conversationId}/messages`, data),
  
  // Message read status
  markMessageAsRead: (messageId) => api.put(`/messaging/messages/${messageId}/read`),
  markConversationAsRead: (conversationId) => api.put(`/messaging/conversations/${conversationId}/read`),
  
  // File upload (always uses multi-file API)
  uploadFiles: (conversationId, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    console.log('Uploading files:', files);
    return api.post(`/messaging/conversations/${conversationId}/upload-files`, formData);
  },
  
            // User status - using mock data since these endpoints don't exist
          getUserStatus: (userId) => Promise.resolve({ data: { status: 'ONLINE', lastSeen: new Date() } }),
          getOnlineUsers: () => Promise.resolve({ data: [] }),
          
          // Update user status
          updateUserStatus: (status) => api.put('/messaging/user/status', { status }),
          
          // Get user profile (mock since endpoint doesn't exist)
          getUserProfile: () => Promise.resolve({ 
            data: { 
              _id: '1f084ac9-c150-6530-ab54-d49ca2307989', // Actual superadmin ID from DB
              username: 'superadmin',
              firstName: 'superadmin',
              lastName: null,
              email: 'superadmin@glowapp.com',
              role: 'SUPER_ADMIN'
            } 
          }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  // Mock users data since there's no public endpoint for listing users
  getUsers: (params) => api.get('/admin/super/user/list', { params }),
  getUser: (id) => api.get(`/user/${id}`),
};

export default api;
