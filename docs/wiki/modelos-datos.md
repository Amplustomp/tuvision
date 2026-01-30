# Modelos de Datos

## Usuario (User)

El modelo de usuario almacena la información de los usuarios del sistema.

### Schema

```typescript
{
  email: string,        // Único, requerido
  password: string,     // Hash bcrypt, requerido
  nombre: string,       // Requerido
  rut: string,          // Requerido
  role: 'admin' | 'vendedor',  // Default: 'vendedor'
  isActive: boolean,    // Default: true
  createdAt: Date,      // Automático
  updatedAt: Date       // Automático
}
```

### Ejemplo en MongoDB

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "vendedor@tuvision.cl",
  "password": "$2b$10$e/ejBBoklQwhe.DokZTCDu7LzyfUDy6WgAu7ZtFFiItAbyLexaAYm",
  "nombre": "Juan Pérez",
  "rut": "12.345.678-9",
  "role": "vendedor",
  "isActive": true,
  "createdAt": "2026-01-30T15:00:00.000Z",
  "updatedAt": "2026-01-30T15:00:00.000Z"
}
```

### Notas de Seguridad

- El campo `password` nunca se devuelve en las respuestas de la API
- Las contraseñas se hashean con bcrypt (10 salt rounds)
- El campo `email` tiene índice único para evitar duplicados

## Orden de Trabajo (WorkOrder)

El modelo de orden de trabajo almacena toda la información de las ventas y servicios de la óptica.

### Schema Principal

```typescript
{
  numeroOrden: number,           // Único, auto-incrementado
  tipoOrden: 'armazon' | 'lentes' | 'lente_completo',
  cliente: CustomerData,         // Subdocumento
  receta?: MedicalPrescription,  // Subdocumento, opcional
  compra: PurchaseData,          // Subdocumento
  fechaVenta: Date,
  observaciones?: string,
  creadoPor: ObjectId,           // Referencia a User
  actualizadoPor?: ObjectId,     // Referencia a User
  createdAt: Date,               // Automático
  updatedAt: Date                // Automático
}
```

### Subdocumento: CustomerData (Datos del Cliente)

```typescript
{
  nombre: string,      // Requerido
  rut: string,         // Requerido
  telefono?: string    // Opcional
}
```

### Subdocumento: MedicalPrescription (Receta Médica)

```typescript
{
  lejos?: {
    od?: EyePrescription,  // Ojo Derecho
    oi?: EyePrescription   // Ojo Izquierdo
  },
  cerca?: {
    od?: EyePrescription,
    oi?: EyePrescription
  },
  add?: string,              // Adición
  detallesLejos?: LensDetails,
  detallesCerca?: LensDetails
}
```

### Subdocumento: EyePrescription (Prescripción por Ojo)

```typescript
{
  esfera?: string,    // Ej: "-2.00", "+1.50"
  cilindro?: string,  // Ej: "-0.50", "-1.00"
  grado?: string      // Ej: "180", "90"
}
```

### Subdocumento: LensDetails (Detalles del Lente)

```typescript
{
  dp?: string,           // Distancia pupilar, ej: "63"
  cristal?: string,      // Tipo de cristal, ej: "Policarbonato"
  codigo?: string,       // Código del cristal, ej: "PC-001"
  color?: string,        // Color, ej: "Transparente"
  armazonMarca?: string  // Marca del armazón, ej: "Ray-Ban RB5154"
}
```

### Subdocumento: PurchaseData (Datos de Compra)

```typescript
{
  totalVenta: number,    // Requerido
  abono?: number,        // Opcional
  saldo: number,         // Requerido
  formaPago: 'efectivo' | 'transferencia' | 'tarjeta',
  fechaEntrega?: Date    // Opcional
}
```

### Ejemplo Completo en MongoDB

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "numeroOrden": 1,
  "tipoOrden": "lente_completo",
  "cliente": {
    "nombre": "María García",
    "rut": "15.678.901-2",
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
    }
  },
  "compra": {
    "totalVenta": 150000,
    "abono": 50000,
    "saldo": 100000,
    "formaPago": "tarjeta",
    "fechaEntrega": "2026-02-15T00:00:00.000Z"
  },
  "fechaVenta": "2026-01-30T00:00:00.000Z",
  "observaciones": "Cliente prefiere entrega en la tarde",
  "creadoPor": "507f1f77bcf86cd799439011",
  "createdAt": "2026-01-30T15:30:00.000Z",
  "updatedAt": "2026-01-30T15:30:00.000Z"
}
```

## Enumeraciones

### Role (Rol de Usuario)

| Valor | Descripción |
|-------|-------------|
| `admin` | Administrador con acceso completo |
| `vendedor` | Vendedor con acceso limitado |

### WorkOrderType (Tipo de Orden)

| Valor | Descripción | Receta Requerida |
|-------|-------------|------------------|
| `armazon` | Venta directa de armazón | No |
| `lentes` | Solo lentes | Sí |
| `lente_completo` | Armazón + lentes | Sí |

### PaymentMethod (Forma de Pago)

| Valor | Descripción |
|-------|-------------|
| `efectivo` | Pago en efectivo |
| `transferencia` | Transferencia bancaria |
| `tarjeta` | Tarjeta de crédito/débito |

## Índices

### Colección Users

| Campo | Tipo | Propósito |
|-------|------|-----------|
| `email` | Único | Evitar emails duplicados |

### Colección WorkOrders

| Campo | Tipo | Propósito |
|-------|------|-----------|
| `numeroOrden` | Único | Identificador secuencial |
| `cliente.rut` | Normal | Búsqueda por RUT |

## Relaciones

```
User (1) -----> (N) WorkOrder
  |                    |
  +-- creadoPor -------+
  +-- actualizadoPor --+
```

Las órdenes de trabajo tienen referencias al usuario que las creó (`creadoPor`) y al último usuario que las modificó (`actualizadoPor`).
