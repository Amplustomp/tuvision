# Tu Visión

Portal para gestión de órdenes de trabajo y solicitudes de compra de anteojos y recetas médicas.

## Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local o Atlas/Railway)

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
MONGODB_URI=mongodb://localhost:27017/tuvision  # o tu URI de MongoDB Atlas/Railway
PORT=3000
JWT_SECRET=tu-clave-secreta-cambiar-en-produccion
JWT_EXPIRES_IN=1h
```

### Generar JWT_SECRET

Para generar una clave segura para JWT_SECRET:
```bash
openssl rand -base64 32
```

Esta clave debe mantenerse secreta y nunca compartirse. En producción, configúrala como variable de entorno en Railway/Heroku/etc.

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

## Crear Usuario Administrador Inicial

El sistema requiere un usuario administrador para gestionar otros usuarios. Para crear el primer admin:

### Opción 1: Usando el script de seed
```bash
cd backend
MONGODB_URI="tu-uri-mongodb" ADMIN_PASSWORD="tu-password-seguro" npm run seed:admin
```

### Opción 2: Insertar directamente en MongoDB
```javascript
db.users.insertOne({
  email: "admin@tuvision.cl",
  password: "<hash-bcrypt-de-tu-password>",
  nombre: "Administrador",
  rut: "00.000.000-0",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Para generar el hash bcrypt:
```bash
node -e "require('bcrypt').hash('tu-password', 10).then(h => console.log(h))"
```

## Estructura del Proyecto

```
tuvision/
├── frontend/           → Angular 17 (SSR habilitado)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              → Servicios y lógica central
│   │   │   │   ├── guards/        → authGuard, adminGuard, guestGuard
│   │   │   │   ├── interceptors/  → authInterceptor (JWT)
│   │   │   │   ├── models/        → User, WorkOrder, Prescription interfaces
│   │   │   │   └── services/      → AuthService, UsersService, WorkOrdersService, PrescriptionsService
│   │   │   ├── features/          → Módulos de funcionalidad
│   │   │   │   ├── auth/          → Login component
│   │   │   │   ├── admin/users/   → Gestión de usuarios (solo admin)
│   │   │   │   ├── prescriptions/ → Gestión de recetas médicas
│   │   │   │   └── work-orders/   → Gestión de órdenes de trabajo
│   │   │   ├── shared/            → Componentes compartidos
│   │   │   │   └── components/
│   │   │   │       ├── layout/           → Sidebar y navegación
│   │   │   │       └── session-warning/  → Alerta de sesión por vencer
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts      → Providers e interceptors
│   │   │   └── app.routes.ts      → Configuración de rutas
│   │   ├── environments/          → Configuración por entorno
│   │   └── styles.scss            → Estilos globales (#0e903c primario)
│   └── ...
├── backend/            → NestJS + MongoDB
│   ├── src/
│   │   ├── auth/              → Autenticación JWT
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/           → LoginDto
│   │   │   ├── guards/        → JwtAuthGuard
│   │   │   └── strategies/    → JwtStrategy
│   │   ├── users/             → Gestión de usuarios
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dto/           → CreateUserDto, UpdateUserDto
│   │   │   └── schemas/       → User schema (Mongoose)
│   │   ├── work-orders/       → Órdenes de trabajo
│   │   │   ├── work-orders.controller.ts
│   │   │   ├── work-orders.service.ts
│   │   │   ├── work-orders.module.ts
│   │   │   ├── dto/           → CreateWorkOrderDto, UpdateWorkOrderDto
│   │   │   └── schemas/       → WorkOrder schema (Mongoose)
│   │   ├── prescriptions/     → Recetas médicas
│   │   │   ├── prescriptions.controller.ts
│   │   │   ├── prescriptions.service.ts
│   │   │   ├── prescriptions.module.ts
│   │   │   ├── dto/           → CreatePrescriptionDto, UpdatePrescriptionDto
│   │   │   └── schemas/       → Prescription schema (Mongoose)
│   │   ├── common/            → Código compartido
│   │   │   ├── decorators/    → @Roles, @CurrentUser
│   │   │   ├── guards/        → RolesGuard
│   │   │   └── enums/         → Role, WorkOrderType, PaymentMethod, OrderNumberType
│   │   ├── scripts/           → Scripts utilitarios
│   │   │   └── seed-admin.ts  → Crear usuario admin inicial
│   │   ├── app.module.ts
│   │   └── main.ts            → Configuración Swagger
│   └── ...
└── docs/                → Documentación detallada
    ├── api-backend.md   → Documentación de la API
    └── wiki/            → Wiki del proyecto
```

## API Backend

El backend implementa una API REST con autenticación JWT. Consultar la documentación completa en [docs/api-backend.md](docs/api-backend.md).

### Documentación Swagger

La API incluye documentación interactiva con Swagger UI disponible en:
- **Local:** http://localhost:3000/api
- **Producción:** https://tuvision-production.up.railway.app/api

Swagger permite:
- Explorar todos los endpoints con descripciones detalladas
- Ver esquemas de request/response con ejemplos
- Autenticarse con JWT (botón "Authorize")
- Probar endpoints directamente desde el navegador

### Endpoints Principales

**Autenticación (`/auth`):**
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | /auth/login | Iniciar sesión | No |
| POST | /auth/register | Registrar usuario | Admin |
| GET | /auth/profile | Obtener perfil | Sí |

**Usuarios (`/users`) - Solo Admin:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /users | Listar todos los usuarios |
| GET | /users/:id | Obtener usuario por ID |
| POST | /users | Crear nuevo usuario |
| PATCH | /users/:id | Actualizar usuario |
| DELETE | /users/:id | Eliminar usuario |

**Autenticación (`/auth`) - Token Refresh:**
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | /auth/refresh | Renovar token JWT | Sí |
| GET | /auth/token-info | Obtener info de expiración | Sí |

**Órdenes de Trabajo (`/work-orders`):**
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /work-orders | Listar todas las órdenes | Sí |
| GET | /work-orders/:id | Obtener orden por ID | Sí |
| GET | /work-orders/by-number/:numero | Buscar por número de orden | Sí |
| GET | /work-orders/by-rut?rut=XX | Buscar por RUT del cliente | Sí |
| POST | /work-orders | Crear nueva orden | Sí |
| PATCH | /work-orders/:id | Actualizar orden | Admin |
| DELETE | /work-orders/:id | Eliminar orden | Admin |

**Recetas Médicas (`/prescriptions`):**
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /prescriptions | Listar todas las recetas | Sí |
| GET | /prescriptions/:id | Obtener receta por ID | Sí |
| GET | /prescriptions/by-rut/:rut | Buscar recetas por RUT del cliente | Sí |
| GET | /prescriptions/latest/:rut | Obtener última receta del cliente | Sí |
| POST | /prescriptions | Crear nueva receta | Sí |
| PATCH | /prescriptions/:id | Actualizar receta | Admin |
| DELETE | /prescriptions/:id | Eliminar receta | Admin |

### Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **admin** | Administrador del sistema | Gestión completa: usuarios, órdenes (crear, ver, editar, eliminar) |
| **vendedor** | Vendedor de la óptica | Crear y ver órdenes de trabajo |

### Funcionalidades del Frontend

**Sistema de Autenticación:**
- Login con validación de formulario
- Almacenamiento de token JWT en localStorage
- Interceptor HTTP para inyección automática del token
- Guards de ruta para protección de acceso

**Gestión de Sesión:**
- Token JWT con expiración de 1 hora
- Alerta visual 5 minutos antes de expirar el token
- Contador regresivo con opción de renovar sesión
- Logout automático por inactividad (15 minutos sin actividad)
- Detección de actividad: mouse, teclado, scroll, touch

**Módulo de Usuarios (Solo Admin):**
- Listado de usuarios con estado activo/inactivo
- Crear nuevos usuarios con validación
- Editar usuarios existentes
- Eliminar usuarios con confirmación
- Cambiar estado activo/inactivo

**Módulo de Órdenes de Trabajo:**
- Listado con búsqueda por nombre, RUT o número de orden
- Filtro por tipo de orden (armazón, lentes, lente completo)
- Filtro por tipo de número de orden (Tu Visión, Opticolors, Optiva VR)
- Crear nuevas órdenes con formulario completo
- Ver detalle de orden en modal
- Editar órdenes (solo admin)
- Eliminar órdenes con confirmación (solo admin)
- Acceso directo a la última receta del cliente

**Módulo de Recetas Médicas:**
- Listado de recetas ordenado por fecha (más reciente primero)
- Búsqueda por RUT del cliente
- Historial de recetas por cliente
- Crear nuevas recetas con datos de ambos ojos (OD/OI)
- Valores de receta soportan números negativos y decimales
- Editar recetas (solo admin)
- Eliminar recetas con confirmación (solo admin)

**Diseño Visual:**
- Color primario: #0e903c (verde)
- Contraste con negro y blanco
- Sidebar de navegación con menú basado en rol
- Diseño responsive

### Tipos de Orden de Trabajo

| Tipo | Descripción | Requiere Receta |
|------|-------------|-----------------|
| **armazon** | Venta directa de armazón | No |
| **lentes** | Solo lentes (cambio de receta/renovación) | Sí |
| **lente_completo** | Armazón + lentes | Sí |

### Formas de Pago

- **efectivo**: Pago en efectivo
- **transferencia**: Transferencia bancaria
- **tarjeta**: Tarjetas de crédito/débito

## Tecnologías Utilizadas

### Backend
- **NestJS 11**: Framework Node.js para APIs escalables
- **MongoDB + Mongoose**: Base de datos NoSQL
- **Passport + JWT**: Autenticación stateless
- **bcrypt**: Hash seguro de contraseñas
- **class-validator**: Validación de DTOs
- **Swagger/OpenAPI**: Documentación interactiva

### Frontend
- **Angular 17**: Framework frontend con SSR
- **TypeScript**: Tipado estático

## Despliegue en Railway

Variables de entorno requeridas:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu-clave-secreta
JWT_EXPIRES_IN=24h
PORT=3000
```

El backend se despliega automáticamente desde la rama `master`.

## Scripts Disponibles

### Backend
```bash
npm run start:dev    # Desarrollo con hot-reload
npm run start:prod   # Producción
npm run build        # Compilar TypeScript
npm run lint         # Verificar código
npm run seed:admin   # Crear usuario admin (requiere ADMIN_PASSWORD)
```

### Frontend
```bash
npm start            # Desarrollo
npm run build        # Build de producción
```

## Documentación Adicional

- [Documentación de la API](docs/api-backend.md)
- [Wiki del Proyecto](docs/wiki/)
