import apiClient from './client';

export const authApi = {
    login: async (credentials: any) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
};
