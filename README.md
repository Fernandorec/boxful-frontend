# Boxful Frontend

Frontend de la aplicación Boxful — envíos ultra-rápidos para LatAm.

## Tecnologías
- Next.js 16
- React
- Ant Design
- Axios
- TypeScript

## Requisitos
- Node.js 18+
- Backend de Boxful corriendo en http://localhost:3001

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Fernandorec/boxful-frontend.git
cd boxful-frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea el archivo `.env.local` en la raíz con estas variables:
   NEXT_PUBLIC_API_URL=http://localhost:3001/api

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación corre en `http://localhost:3000`

## Vistas

| Ruta | Descripción |
|------|-------------|
| /login | Inicio de sesión |
| /registro | Registro de usuario |
| /ordenes | Historial de órdenes |
| /ordenes/nueva | Crear nueva orden |

## Funcionalidades
- Registro e inicio de sesión con JWT
- Crear órdenes con múltiples paquetes
- Historial de órdenes con filtros por fecha
- Exportar órdenes a CSV
- Soporte para órdenes COD (cobro contra entrega)
- Diseño responsive para móvil y desktop

## Esfuerzos extra
- Middleware de protección de rutas
- Dropdown de cierre de sesión
- Confirmación de número de teléfono al registrarse
- Selector de código de país en WhatsApp
