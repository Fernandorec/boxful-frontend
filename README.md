# Boxful Frontend

Frontend de la aplicación Boxful — envíos ultra-rápidos para LatAm.

## Tecnologías
- Next.js 16
- React
- Ant Design
- Axios
- TypeScript
- react-datepicker

## Requisitos
- Node.js 18+
- Backend de Boxful corriendo en http://localhost:3001

## Instalación

1. Clona el repositorio:

git clone https://github.com/Fernandorec/boxful-frontend.git
cd boxful-frontend

2. Instala las dependencias:

npm install

3. Crea el archivo `.env.local` en la raíz con estas variables:

NEXT_PUBLIC_API_URL=http://localhost:3001/api

4. Inicia el servidor de desarrollo:

npm run dev

La aplicación corre en http://localhost:3000

## Vistas

| Ruta | Descripción |
|------|-------------|
| /login | Inicio de sesión |
| /registro | Registro de usuario |
| /ordenes | Historial de órdenes |
| /ordenes/nueva | Crear nueva orden |

## Funcionalidades
- Registro e inicio de sesión con JWT
- Validaciones en registro: nombre sin caracteres especiales, edad mínima 18 años, teléfono exactamente 8 dígitos, contraseña máximo 30 caracteres
- Crear órdenes con múltiples paquetes
- Validaciones en paquetes: dimensiones mínimo 50 cm, máximo 10,000 cm, solo números
- Historial de órdenes con filtros por fecha
- Exportar órdenes a CSV con todos los detalles
- Soporte para órdenes COD (cobro contra entrega)
- Diseño responsive para móvil y desktop
- Persistencia de datos en localStorage al crear órdenes y registro

## Patrones de diseño
- Service Layer — llamadas HTTP centralizadas en services/
- Interceptor Pattern — JWT agregado automáticamente en cada petición
- Layout Pattern — sidebar y header compartidos en dashboard
- Controlled Component Pattern — formularios controlados con Ant Design

## Esfuerzos extra
- Middleware de protección de rutas
- Dropdown de cierre de sesión
- Confirmación de número de teléfono al registrarse
- Selector de código de país en WhatsApp
- Menú activo resaltado según ruta actual
- Botón de limpiar datos en formulario de orden
- Validación de fechas futuras en órdenes
- Validación de monto COD con máximo 2 decimales