import api from './axiosInstance';

// ─── Stages ───────────────────────────────────────────────────────────────
export const getStages = () => api.get('/settings/stages');
export const createStage = (data) => api.post('/settings/stages', data);
export const updateStage = (id, data) => api.put(`/settings/stages/${id}`, data);
export const deleteStage = (id) => api.delete(`/settings/stages/${id}`);

// ─── Rules ────────────────────────────────────────────────────────────────
export const getRules = () => api.get('/settings/rules');
export const createRule = (data) => api.post('/settings/rules', data);
export const deleteRule = (id) => api.delete(`/settings/rules/${id}`);
