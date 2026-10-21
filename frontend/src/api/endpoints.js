import api from './client';

export const login = (username, password) => api.post('/auth/login', { username, password });

export const register = (payload) => api.post('/auth/register', payload);

export const getMyCustomerProfile = () => api.get('/customers/me');
export const updateMyCustomerProfile = (fields) => api.put('/customers/me', fields);

export const getProducts = (category) => api.get('/products', { params: category ? { category } : {} });
export const createProduct = (payload) => api.post('/products', payload);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);
export const deactivateProduct = (id) => api.delete(`/products/${id}`);

export const getMyPolicies = () => api.get('/policies/me');
export const getAllPolicies = () => api.get('/policies');
export const purchasePolicy = (payload) => api.post('/policies/purchase', payload);
export const renewPolicy = (id) => api.post(`/policies/${id}/renew`);
export const cancelPolicy = (id) => api.post(`/policies/${id}/cancel`);
export const approveCancellation = (id) => api.post(`/policies/${id}/approve-cancellation`);

export const getMyClaims = () => api.get('/claims/me');
export const fileClaim = (payload) => api.post('/claims', payload);
export const getClaimQueue = (status) => api.get('/claims/review/queue', { params: status ? { status } : {} });
export const markUnderReview = (id) => api.post(`/claims/review/${id}/under-review`);
export const requestDocuments = (id, comments) => api.post(`/claims/review/${id}/request-documents`, { comments });
export const approveClaim = (id, payload) => api.post(`/claims/review/${id}/approve`, payload);
export const rejectClaim = (id, payload) => api.post(`/claims/review/${id}/reject`, payload);
export const settleClaim = (id, payload) => api.post(`/claims/review/${id}/settle`, payload);

export const getMyPayments = () => api.get('/payments/me');
export const makePayment = (payload) => api.post('/payments', payload);

export const getAdminSummary = () => api.get('/reports/admin/summary');
