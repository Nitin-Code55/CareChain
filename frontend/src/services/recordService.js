import api from './api';

export const recordService = {
  uploadRecord: async (formData) => {
    const res = await api.post('/records', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getMyRecords: async () => {
    const res = await api.get('/records');
    return res.data;
  },

  getDoctorRecords: async () => {
    const res = await api.get('/records/doctor');
    return res.data;
  },

  getRecordById: async (id) => {
    const res = await api.get(`/records/${id}`);
    return res.data;
  },

  downloadRecord: async (id, originalFilename = 'medical-record') => {
    const res = await api.get(`/records/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalFilename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  verifyRecord: async (id) => {
    const res = await api.post(`/records/${id}/verify`);
    return res.data;
  },
};

export default recordService;
