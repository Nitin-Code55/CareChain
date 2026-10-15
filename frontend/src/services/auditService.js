import api from './api';

export const auditService = {
  getAllAuditLogs: async () => {
    const res = await api.get('/audit');
    return res.data;
  },

  getMyActivity: async () => {
    const res = await api.get('/audit/my');
    return res.data;
  },
};

export const adminService = {
  getStatistics: async () => {
    const res = await api.get('/admin/statistics');
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
};

export default auditService;
