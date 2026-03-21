import api from './axiosInstance';

/** GET /api/eco */
export const getECOs = () => api.get('/eco');

/** GET /api/eco/:id */
export const getECOById = (id) => api.get(`/eco/${id}`);

/** POST /api/eco */
export const createECO = (data) => api.post('/eco', data);

/** PUT /api/eco/:id */
export const updateECO = (id, data) => api.put(`/eco/${id}`, data);

/** POST /api/eco/:id/validate */
export const validateECO = (id) => api.post(`/eco/${id}/validate`);

/** POST /api/eco/:id/approve */
export const approveECO = (id) => api.post(`/eco/${id}/approve`);

/** POST /api/eco/:id/apply */
export const applyECO = (id) => api.post(`/eco/${id}/apply`);
