import api from './api';

export const permissionService = {
  getAvailableDoctors: async () => {
    const res = await api.get('/permissions/doctors');
    return res.data;
  },

  getMyPermissions: async () => {
    const res = await api.get('/permissions');
    return res.data;
  },

  grantPermission: async (doctorId, notes = '') => {
    const res = await api.post('/permissions', { doctorId, notes });
    return res.data;
  },

  revokePermission: async (permissionId) => {
    const res = await api.delete(`/permissions/${permissionId}`);
    return res.data;
  },

  getAccessiblePatients: async () => {
    const res = await api.get('/permissions/patients');
    return res.data;
  },
};

export default permissionService;
