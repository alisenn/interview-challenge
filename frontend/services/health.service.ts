import apiClient from '../lib/api-client';

export const healthService = {
  async check(): Promise<any> {
    const response = await apiClient.get('/health');
    return response.data;
  },
};
