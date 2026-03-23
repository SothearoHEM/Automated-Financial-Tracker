import api from './index';

export const goalsAPI = {
  // Get all goals with optional status filter
  getAll: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get(`/api/goals?${new URLSearchParams(params).toString()}`);
    return response;
  },

  // Get single goal
  getById: async (id) => {
    const response = await api.get(`/api/goals/${id}`);
    return response;
  },

  // Create new goal
  create: async (goalData) => {
    const response = await api.post('/api/goals', goalData);
    return response;
  },

  // Update goal
  update: async (id, goalData) => {
    const response = await api.put(`/api/goals/${id}`, goalData);
    return response;
  },

  // Delete goal (soft delete)
  delete: async (id) => {
    const response = await api.delete(`/api/goals/${id}`);
    return response;
  },
};