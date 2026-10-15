import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/me');
    return res.data;
  },

  updatePatientProfile: async (data) => {
    const res = await api.put('/users/patient/profile', data);
    return res.data;
  },

  updateDoctorProfile: async (data) => {
    const res = await api.put('/users/doctor/profile', data);
    return res.data;
  },
};

export default userService;
