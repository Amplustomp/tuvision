# Tu Visión

Portal para gestión de órdenes de trabajo y solicitudes de compra de anteojos y recetas médicas.

## Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local o Atlas)

## Instalación

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
```

## Configuración del Backend

Editar el archivo `backend/.env` con las siguientes variables:

```env
MONGODB_URI=mongodb://localhost:27017/tuvision  # o tu URI de MongoDB Atlas
PORT=3000
JWT_SECRET=tu-clave-secreta-cambiar-en-produccion
JWT_EXPIRES_IN=24h
```

## Desarrollo

### Frontend (http://localhost:4200)
```bash
cd frontend
npm start
```

### Backend (http://localhost:3000)
```bash
cd backend
npm run start:dev
```

## Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm run build
```

## Estructura del Proyecto

```
tuvision/
├── frontend/    → Angular 17 (SSR habilitado)
├── backend/     → NestJS + MongoDB
│   ├── src/
│   │   ├── auth/           → Autenticación JWT
│   │   ├── users/          → Gestión de usuarios
│   │   ├── work-orders/    → Órdenes de trabajo
│   │   └── common/         → Guards, decorators, enums
│   └── ...
└── docs/        → Documentación
```

## API Backend

El backend implementa una API REST con autenticación JWT. Consultar la documentación completa en [docs/api-backend.md](docs/api-backend.md).

### Endpoints Principales

**Autenticación:**
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario (solo admin)
- `GET /auth/profile` - Obtener perfil

**Usuarios (solo admin):**
- `GET/POST/PATCH/DELETE /users`

**Órdenes de Trabajo:**
- `GET/POST/PATCH/DELETE /work-orders`
- `GET /work-orders/by-number/:numero`
- `GET /work-orders/by-rut?rut=XX`

### Roles de Usuario

- **admin**: Gestión completa del sistema
- **vendedor**: Crear y gestionar órdenes de trabajo

### Tipos de Orden de Trabajo

- **armazon**: Venta directa de armazón
- **lentes**: Solo lentes (cambio de receta/renovación)
- **lente_completo**: Armazón + lentes
