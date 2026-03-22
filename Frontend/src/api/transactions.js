import api from './index';

export const transactionsAPI = {
  // Get all transactions with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value && value !== 'All Types' && value !== 'All Categories' && value !== 'All Currencies') {
        // Lowercase type for backend compatibility
        if (key === 'type') {
          params.append(key, value.toLowerCase());
        } else {
          params.append(key, value);
        }
      }
    });
    const response = await api.get(`/api/transactions?${params.toString()}`);
    return response;
  },

  // Get single transaction
  getById: async (id) => {
    const response = await api.get(`/api/transactions/${id}`);
    return response;
  },

  // Create new transaction
  create: async (transactionData) => {
    const response = await api.post('/api/transactions', transactionData);
    return response;
  },

  // Update transaction
  update: async (id, transactionData) => {
    const response = await api.put(`/api/transactions/${id}`, transactionData);
    return response;
  },

  // Delete transaction (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/api/transactions/${id}`);
    return response;
  },
};
