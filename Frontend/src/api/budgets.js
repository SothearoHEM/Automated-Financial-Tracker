import api from './index';

export const budgetsAPI = {
  // Get all budgets with optional period filter
  getAll: async (period = null) => {
    const params = period ? { period } : {};
    const response = await api.get(`/api/budgets?${new URLSearchParams(params).toString()}`);
    return response;
  },

  // Get single budget
  getById: async (id) => {
    const response = await api.get(`/api/budgets/${id}`);
    return response;
  },

  // Create or update budget (upsert)
  create: async (budgetData) => {
    const response = await api.post('/api/budgets', budgetData);
    return response;
  },

  // Update budget
  update: async (id, budgetData) => {
    const response = await api.put(`/api/budgets/${id}`, budgetData);
    return response;
  },

  // Delete budget (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/api/budgets/${id}`);
    return response;
  },
};
