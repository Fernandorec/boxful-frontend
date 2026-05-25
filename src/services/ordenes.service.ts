import { api } from './api';

export const OrdenesService = {
  async crear(datos: any) {
    const { data } = await api.post('/ordenes', datos);
    return data;
  },

  async obtenerTodas(filtros?: any) {
    const { data } = await api.get('/ordenes', { params: filtros });
    return data;
  },

  async obtenerPorId(id: string) {
    const { data } = await api.get(`/ordenes/${id}`);
    return data;
  },
};