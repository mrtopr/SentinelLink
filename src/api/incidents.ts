import apiClient from './client';

export const incidentApi = {
    getIncidents: async (params?: any) => {
        const response = await apiClient.get('/incidents', { params });
        return response.data;
    },
    getIncidentById: async (id: string) => {
        const response = await apiClient.get(`/incidents/${id}`);
        return response.data;
    },
    createIncident: async (formData: FormData) => {
        const response = await apiClient.post('/incidents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateIncidentStatus: async (id: string, status: string) => {
        const response = await apiClient.patch(`/incidents/${id}/status`, { status });
        return response.data;
    },
    upvoteIncident: async (id: string) => {
        const response = await apiClient.post(`/incidents/${id}/upvote`);
        return response.data;
    },
    deleteIncident: async (id: string) => {
        const response = await apiClient.delete(`/incidents/${id}`);
        return response.data;
    },
    addNote: async (id: string, note: string) => {
        const response = await apiClient.post(`/incidents/${id}/notes`, { note });
        return response.data;
    },
    updateSeverity: async (id: string, severity: string) => {
        const response = await apiClient.patch(`/incidents/${id}/severity`, { severity });
        return response.data;
    },
};
