import apiClient from './client';

export const userApi = {
    /**
     * Get all users (Admin only)
     */
    getUsers: async () => {
        const response = await apiClient.get('/auth/users'); // Assuming this endpoint exists based on standard patterns
        return response.data;
    },

    /**
     * Delete a user
     */
    deleteUser: async (id: string) => {
        const response = await apiClient.delete(`/auth/users/${id}`);
        return response.data;
    }
};
