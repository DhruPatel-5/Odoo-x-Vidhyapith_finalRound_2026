import api from './axiosInstance';

/** GET /api/products */
export const getProducts = () => api.get('/products');

/** GET /api/products/:id */
export const getProductById = (id) => api.get(`/products/${id}`);

/** GET /api/products/:id/history */
export const getProductHistory = (id) => api.get(`/products/${id}/history`);

/** POST /api/products */
export const createProduct = (data) => api.post('/products', data);

/** PUT /api/products/:id */
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

/** DELETE /api/products/:id (archive) */
export const archiveProduct = (id) => api.delete(`/products/${id}`);
