import { api } from './api';
import { CrearOrdenPayload, FiltrosOrden, Orden } from '@/types';

export const OrdenesService = {
  async crear(datos: CrearOrdenPayload): Promise<Orden> {
    const { data } = await api.post('/ordenes', datos);
    return data;
  },

  async obtenerTodas(filtros?: FiltrosOrden): Promise<Orden[]> {
    const { data } = await api.get('/ordenes', { params: filtros });
    return data;
  },

  async obtenerPorId(id: string): Promise<Orden> {
    const { data } = await api.get(`/ordenes/${id}`);
    return data;
  },
};