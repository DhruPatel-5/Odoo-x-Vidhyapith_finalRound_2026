import api from './axiosInstance';

/** GET /api/reports/eco */
export const getECOReport = () => api.get('/reports/eco');

/** GET /api/reports/version-history */
export const getVersionHistory = () => api.get('/reports/version-history');

/** GET /api/reports/bom-history */
export const getBOMHistory = () => api.get('/reports/bom-history');

/** GET /api/reports/archived */
export const getArchived = () => api.get('/reports/archived');

/** GET /api/reports/active-matrix */
export const getActiveMatrix = () => api.get('/reports/active-matrix');

/** GET /api/reports/audit */
export const getAuditLog = (params) => api.get('/reports/audit', { params });
