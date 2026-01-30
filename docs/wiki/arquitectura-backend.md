# Arquitectura del Backend

## Visión General

El backend de Tu Visión está construido con NestJS, un framework progresivo de Node.js que utiliza TypeScript y sigue los principios de arquitectura modular. La aplicación implementa una API REST con autenticación JWT y se conecta a MongoDB como base de datos.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | 11.x | Framework principal |
| MongoDB | - | Base de datos NoSQL |
| Mongoose | 9.x | ODM para MongoDB |
| Passport | 0.7.x | Middleware de autenticación |
| JWT | - | Tokens de autenticación |
| bcrypt | 6.x | Hash de contraseñas |
| class-validator | 0.14.x | Validación de DTOs |
| Swagger | 11.x | Documentación de API |

## Estructura de Módulos

```
src/
├── main.ts              → Punto de entrada, configuración Swagger
├── app.module.ts        → Módulo raíz
├── auth/                → Módulo de autenticación
├── users/               → Módulo de usuarios
├── work-orders/         → Módulo de órdenes de trabajo
├── common/              → Código compartido
└── scripts/             → Scripts utilitarios
```

## Módulo de Autenticación (`auth/`)

### Responsabilidades
- Login de usuarios
- Registro de nuevos usuarios (solo admin)
- Obtención de perfil del usuario autenticado
- Generación y validación de tokens JWT

### Archivos Principales

**auth.controller.ts**
```typescript
@Controller('auth')
export class AuthController {
  @Post('login')           // Público
  @Post('register')        // Requiere admin
  @Get('profile')          // Requiere autenticación
}
```

**auth.service.ts**
- `login(loginDto)`: Valida credenciales y genera JWT
- `register(createUserDto)`: Crea nuevo usuario (delegado a UsersService)
- `getProfile(userId)`: Obtiene datos del usuario autenticado

**jwt.strategy.ts**
Implementa la estrategia de Passport para validar tokens JWT. Extrae el payload del token y lo adjunta al request.

**jwt-auth.guard.ts**
Guard que protege rutas requiriendo un token JWT válido.

### Flujo de Autenticación

```
1. Usuario envía POST /auth/login con email y password
2. AuthService valida credenciales contra la base de datos
3. Si son válidas, genera un JWT con el userId y role
4. El token se devuelve al cliente
5. Cliente incluye token en header: Authorization: Bearer <token>
6. JwtAuthGuard intercepta requests y valida el token
7. JwtStrategy extrae el payload y lo adjunta a request.user
```

## Módulo de Usuarios (`users/`)

### Responsabilidades
- CRUD completo de usuarios
- Validación de contraseñas
- Hash seguro de passwords con bcrypt

### Schema de Usuario (Mongoose)

```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;  // Hash bcrypt

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  rut: string;

  @Prop({ type: String, enum: Role, default: Role.VENDEDOR })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;
}
```

### Seguridad de Contraseñas

- Las contraseñas se hashean con bcrypt (salt rounds: 10)
- Nunca se devuelve el campo password en las respuestas
- La validación usa `bcrypt.compare()` para comparar hashes

## Módulo de Órdenes de Trabajo (`work-orders/`)

### Responsabilidades
- CRUD de órdenes de trabajo
- Búsqueda por número de orden
- Búsqueda por RUT del cliente
- Numeración automática secuencial
- Registro de auditoría (quién creó/modificó)

### Schema de Orden de Trabajo

```typescript
@Schema({ timestamps: true })
export class WorkOrder {
  @Prop({ required: true, unique: true })
  numeroOrden: number;  // Auto-incrementado

  @Prop({ type: String, enum: WorkOrderType, required: true })
  tipoOrden: WorkOrderType;

  @Prop({ type: CustomerDataSchema, required: true })
  cliente: CustomerData;

  @Prop({ type: MedicalPrescriptionSchema })
  receta?: MedicalPrescription;  // Opcional para armazón

  @Prop({ type: PurchaseDataSchema, required: true })
  compra: PurchaseData;

  @Prop({ required: true })
  fechaVenta: Date;

  @Prop()
  observaciones?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creadoPor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  actualizadoPor?: Types.ObjectId;
}
```

### Tipos de Orden

| Tipo | Descripción | Receta Requerida |
|------|-------------|------------------|
| `armazon` | Venta directa de armazón | No |
| `lentes` | Solo lentes (cambio/renovación) | Sí |
| `lente_completo` | Armazón + lentes | Sí |

### Estructura de Receta Médica

```typescript
interface MedicalPrescription {
  lejos?: {
    od?: { esfera, cilindro, grado }  // Ojo Derecho
    oi?: { esfera, cilindro, grado }  // Ojo Izquierdo
  }
  cerca?: {
    od?: { esfera, cilindro, grado }
    oi?: { esfera, cilindro, grado }
  }
  add?: string  // Adición
  detallesLejos?: LensDetails
  detallesCerca?: LensDetails
}

interface LensDetails {
  dp?: string        // Distancia pupilar
  cristal?: string   // Tipo de cristal
  codigo?: string    // Código del cristal
  color?: string     // Color
  armazonMarca?: string  // Marca del armazón
}
```

## Módulo Common (`common/`)

### Decoradores

**@Roles(Role.ADMIN, Role.VENDEDOR)**
Decorador para especificar qué roles pueden acceder a un endpoint.

**@CurrentUser()**
Decorador de parámetro que extrae el usuario del request.

### Guards

**RolesGuard**
Guard que verifica si el usuario tiene el rol requerido para acceder al endpoint.

### Enums

```typescript
enum Role {
  ADMIN = 'admin',
  VENDEDOR = 'vendedor'
}

enum WorkOrderType {
  ARMAZON = 'armazon',
  LENTES = 'lentes',
  LENTE_COMPLETO = 'lente_completo'
}

enum PaymentMethod {
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  TARJETA = 'tarjeta'
}
```

## Configuración

### Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `MONGODB_URI` | URI de conexión a MongoDB | Sí |
| `JWT_SECRET` | Clave secreta para firmar tokens | Sí |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | No (default: 24h) |
| `PORT` | Puerto del servidor | No (default: 3000) |

### ConfigModule

El módulo de configuración de NestJS se usa para cargar variables de entorno:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
})
```

## Swagger/OpenAPI

La documentación de la API se genera automáticamente usando decoradores de `@nestjs/swagger`:

- `@ApiTags()` - Agrupa endpoints por módulo
- `@ApiOperation()` - Describe el propósito del endpoint
- `@ApiResponse()` - Documenta posibles respuestas
- `@ApiBearerAuth()` - Indica que requiere autenticación JWT
- `@ApiProperty()` - Documenta propiedades de DTOs

La documentación está disponible en `/api`.

## Validación de Datos

Se usa `class-validator` con `ValidationPipe` global:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Elimina propiedades no definidas
    forbidNonWhitelisted: true, // Error si hay propiedades extra
    transform: true,           // Transforma tipos automáticamente
  }),
);
```

## Manejo de Errores

NestJS maneja automáticamente las excepciones y las convierte en respuestas HTTP apropiadas:

| Excepción | Código HTTP |
|-----------|-------------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |
| `ConflictException` | 409 |

## CORS

CORS está habilitado para permitir acceso desde el frontend:

```typescript
app.enableCors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```
