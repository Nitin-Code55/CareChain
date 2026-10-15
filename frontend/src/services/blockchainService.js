import api from './api';

export const blockchainService = {
  getBlocks: async () => {
    const res = await api.get('/blockchain/blocks');
    return res.data;
  },

  verifyChain: async () => {
    const res = await api.get('/blockchain/verify');
    return res.data;
  },
};

export default blockchainService;
