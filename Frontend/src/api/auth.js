import api from './index';

export const authAPI = {
  // Register new user
  register: async (name, username, password, password_confirmation) => {
    const response = await api.post('/api/register', {
      name,
      username,
      password,
      password_confirmation,
    });
    return response;
  },

  // Login user
  login: async (username, password) => {
    const response = await api.post('/api/login', {
      username,
      password,
    });
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/api/logout');
    return response;
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    const response = await api.get('/api/user');
    return response;
  },

  // Update user exchange rate
  updateExchangeRate: async (exchangeRate) => {
    const response = await api.post('/api/user/exchange-rate', {
      exchange_rate: exchangeRate,
    });
    return response;
  },
};
