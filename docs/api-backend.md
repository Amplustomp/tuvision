# API Backend - Documentación

## Descripción General

El backend de Tu Visión está construido con NestJS y utiliza MongoDB como base de datos. Implementa autenticación JWT y gestión de usuarios con roles diferenciados.

## Documentación Swagger

La API incluye documentación interactiva con Swagger UI que permite explorar y probar todos los endpoints directamente desde el navegador.

**URL de acceso:**
- Local: `http://localhost:3000/api`
- Producción: `https://tu-dominio.com/api`

Swagger UI proporciona:
- Descripción detallada de cada endpoint
- Esquemas de request/response con ejemplos
- Autenticación JWT integrada (botón "Authorize")
- Posibilidad de ejecutar requests de prueba

## Autenticación

El sistema utiliza JSON Web Tokens (JWT) para la autenticación. Los tokens se envían en el header `Authorization` con el formato `Bearer <token>`.

### Endpoints de Autenticación

#### POST /auth/login
Inicia sesión y obtiene un token de acceso.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan Pérez",
    "role": "vendedor"
  }
}
```

#### POST /auth/register
Registra un nuevo usuario (solo administradores).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "nombre": "María García",
  "rut": "12.345.678-9",
  "role": "vendedor"
}
```

#### GET /auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

#### POST /auth/refresh
Renueva el token JWT antes de que expire.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400000,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@ejemplo.com",
    "nombre": "Juan Pérez",
    "role": "vendedor"
  }
}
```

#### GET /auth/token-info
Obtiene información sobre la expiración del token actual.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "expires_in": 3600000
}
```

## Gestión de Usuarios

Todos los endpoints de usuarios requieren autenticación y rol de administrador.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /users | Lista todos los usuarios |
| GET | /users/:id | Obtiene un usuario por ID |
| POST | /users | Crea un nuevo usuario |
| PATCH | /users/:id | Actualiza un usuario |
| DELETE | /users/:id | Elimina un usuario |

### Roles de Usuario

- **admin**: Acceso completo al sistema, puede gestionar usuarios y eliminar órdenes de trabajo.
- **vendedor**: Puede crear, ver y actualizar órdenes de trabajo.

## Órdenes de Trabajo

### Tipos de Orden

- **armazon**: Venta directa de armazón.
- **lentes**: Solo lentes (cambio de receta o renovación).
- **lente_completo**: Armazón + lentes (puede ser para cerca, lejos, o sol con/sin receta).

### Endpoints

| Método | Endpoint | Descripción | Rol Requerido |
|--------|----------|-------------|---------------|
| GET | /work-orders | Lista todas las órdenes | Autenticado |
| GET | /work-orders/:id | Obtiene una orden por ID | Autenticado |
| GET | /work-orders/by-number/:numeroOrden | Obtiene orden por número | Autenticado |
| GET | /work-orders/by-rut?rut=XX | Busca órdenes por RUT del cliente | Autenticado |
| POST | /work-orders | Crea una nueva orden | Autenticado |
| PATCH | /work-orders/:id | Actualiza una orden | Admin |
| DELETE | /work-orders/:id | Elimina una orden | Admin |

### Estructura de Orden de Trabajo

```json
{
  "tipoOrden": "lente_completo",
  "cliente": {
    "nombre": "Juan Pérez",
    "rut": "12.345.678-9",
    "telefono": "+56912345678"
  },
  "receta": {
    "lejos": {
      "od": { "esfera": "-2.00", "cilindro": "-0.50", "grado": "180" },
      "oi": { "esfera": "-1.75", "cilindro": "-0.25", "grado": "175" }
    },
    "cerca": {
      "od": { "esfera": "-1.00", "cilindro": "-0.50", "grado": "180" },
      "oi": { "esfera": "-0.75", "cilindro": "-0.25", "grado": "175" }
    },
    "add": "+2.00",
    "detallesLejos": {
      "dp": "63",
      "cristal": "Policarbonato",
      "codigo": "PC-001",
      "color": "Transparente",
      "armazonMarca": "Ray-Ban RB5154"
    },
    "detallesCerca": {
      "dp": "60",
      "cristal": "CR-39",
      "codigo": "CR-002",
      "color": "Transparente",
      "armazonMarca": "Oakley OX8046"
    }
  },
  "compra": {
    "totalVenta": 150000,
    "abono": 50000,
    "saldo": 100000,
    "formaPago": "tarjeta",
    "fechaEntrega": "2026-02-15"
  },
  "fechaVenta": "2026-01-30",
  "observaciones": "Cliente prefiere entrega en la tarde"
}
```

### Formas de Pago

- **efectivo**: Pago en efectivo
- **transferencia**: Transferencia bancaria
- **tarjeta**: Tarjetas de crédito/débito

### Campos de Auditoría

Cada orden de trabajo incluye automáticamente:

- **numeroOrden**: Número secuencial autogenerado
- **creadoPor**: Referencia al usuario que creó la orden
- **actualizadoPor**: Referencia al último usuario que modificó la orden
- **createdAt**: Fecha de creación (automático)
- **updatedAt**: Fecha de última actualización (automático)

## Configuración

### Variables de Entorno

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>

# API
PORT=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - Token inválido o expirado |
| 403 | Forbidden - Sin permisos para esta acción |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - El recurso ya existe (ej: email duplicado) |
