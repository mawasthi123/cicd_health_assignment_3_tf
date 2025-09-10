import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

export const fetchMetrics = () => axios.get(`${API_URL}/api/metrics`);
export const fetchBuilds = () => axios.get(`${API_URL}/api/builds`);
export const fetchBuildLogs = (id) => axios.get(`${API_URL}/api/builds/${id}/logs`);
export const triggerTestAlert = () => axios.post(`${API_URL}/api/alerts/test`);