# Guía de Desarrollo

## Configuración del Entorno

### Requisitos Previos

1. **Node.js** >= 18.0.0
2. **npm** >= 9.0.0
3. **MongoDB** (local o remoto)
4. **Git**

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/Amplustomp/tuvision.git
cd tuvision

# Instalar dependencias del backend
cd backend
npm install

# Copiar archivo de configuración
cp .env.example .env
```

### Configuración de Variables de Entorno

Editar `backend/.env`:

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/tuvision

# Servidor
PORT=3000

# JWT
JWT_SECRET=tu-clave-secreta-aqui
JWT_EXPIRES_IN=24h
```

Para generar un JWT_SECRET seguro:
```bash
openssl rand -base64 32
```

## Ejecutar en Desarrollo

### Backend

```bash
cd backend
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`.

La documentación Swagger estará en `http://localhost:3000/api`.

### Frontend

```bash
cd frontend
npm start
```

El frontend estará disponible en `http://localhost:4200`.

## Crear Usuario Administrador

Para crear el primer usuario administrador:

```bash
cd backend
ADMIN_PASSWORD="tu-password-seguro" npm run seed:admin
```

O insertar directamente en MongoDB:

```javascript
db.users.insertOne({
  email: "admin@tuvision.cl",
  password: "$2b$10$...",  // Hash bcrypt
  nombre: "Administrador",
  rut: "00.000.000-0",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Estructura de Archivos

### Backend

```
backend/
├── src/
│   ├── main.ts                 # Punto de entrada
│   ├── app.module.ts           # Módulo raíz
│   ├── auth/                   # Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── index.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── index.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── users/                  # Usuarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── index.ts
│   │   └── schemas/
│   │       └── user.schema.ts
│   ├── work-orders/            # Órdenes de trabajo
│   │   ├── work-orders.controller.ts
│   │   ├── work-orders.service.ts
│   │   ├── work-orders.module.ts
│   │   ├── dto/
│   │   │   ├── create-work-order.dto.ts
│   │   │   ├── update-work-order.dto.ts
│   │   │   └── index.ts
│   │   └── schemas/
│   │       └── work-order.schema.ts
│   ├── common/                 # Código compartido
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── index.ts
│   │   ├── guards/
│   │   │   ├── roles.guard.ts
│   │   │   └── index.ts
│   │   └── enums/
│   │       └── index.ts
│   └── scripts/
│       └── seed-admin.ts
├── test/
├── package.json
├── tsconfig.json
└── .env.example
```

## Convenciones de Código

### Nomenclatura

- **Archivos**: kebab-case (`create-user.dto.ts`)
- **Clases**: PascalCase (`CreateUserDto`)
- **Variables/Funciones**: camelCase (`findByEmail`)
- **Constantes**: UPPER_SNAKE_CASE (`JWT_SECRET`)

### DTOs

Los DTOs (Data Transfer Objects) definen la estructura de los datos de entrada:

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email del usuario', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Schemas (Mongoose)

Los schemas definen la estructura de los documentos en MongoDB:

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
```

### Controllers

Los controllers manejan las rutas HTTP:

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar usuarios' })
  findAll() {
    return this.usersService.findAll();
  }
}
```

### Services

Los services contienen la lógica de negocio:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }
}
```

## Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con watch mode
npm run test:watch

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## Linting y Formateo

```bash
# Verificar y corregir errores de lint
npm run lint

# Formatear código
npm run format
```

## Build de Producción

```bash
cd backend
npm run build
```

Los archivos compilados se generan en `dist/`.

## Despliegue

### Railway

1. Conectar el repositorio de GitHub a Railway
2. Configurar las variables de entorno:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `PORT`
3. Railway detectará automáticamente el proyecto NestJS y lo desplegará

### Verificar Despliegue

1. Acceder a la URL de Railway
2. Verificar que `/api` muestra la documentación Swagger
3. Probar el endpoint `/auth/login`

## Troubleshooting

### Error: Cannot connect to MongoDB

Verificar que:
1. MongoDB está corriendo
2. La URI en `MONGODB_URI` es correcta
3. Las credenciales son válidas

### Error: JWT_SECRET is not defined

Asegurarse de que la variable `JWT_SECRET` está definida en el archivo `.env` o en las variables de entorno.

### Error: Unauthorized (401)

Verificar que:
1. El token JWT es válido y no ha expirado
2. El header `Authorization` tiene el formato `Bearer <token>`
3. El usuario existe y está activo
