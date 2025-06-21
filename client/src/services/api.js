import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const fetchQuery = (num) =>
  api.get(`/query/${num}`);

export const fetchQueryWithParam = (num, param) =>
  api.get(`/query/${num}?${param}`);

export const createProveedor = (data) =>
  api.post('/proveedores', data);

export const createProducto = (data) =>
  api.post('/productos', data);

export const createOrden = (data) =>
  api.post('/ordenes', data);

export default api;