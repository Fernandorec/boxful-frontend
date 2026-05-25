import { api } from './api';
import Cookies from 'js-cookie';

export const AuthService = {
  async registrar(datos: {
    nombre: string;
    apellido: string;
    sexo?: string;
    fechaNacimiento?: string;
    correo: string;
    telefono: string;
    codigoTelefono: string;
    contrasena: string;
  }) {
    const { data } = await api.post('/auth/registro', datos);
    Cookies.set('token', data.token, { expires: 7 });
    Cookies.set('usuario', JSON.stringify(data.usuario), { expires: 7 });
    return data;
  },

  async iniciarSesion(correo: string, contrasena: string) {
    const { data } = await api.post('/auth/login', { correo, contrasena });
    Cookies.set('token', data.token, { expires: 7 });
    Cookies.set('usuario', JSON.stringify(data.usuario), { expires: 7 });
    return data;
  },

  cerrarSesion() {
    Cookies.remove('token');
    Cookies.remove('usuario');
    window.location.href = '/login';
  },

  obtenerUsuario() {
    const usuario = Cookies.get('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },
};