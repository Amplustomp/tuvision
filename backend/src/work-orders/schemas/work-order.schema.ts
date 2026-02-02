import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  PaymentMethod,
  WorkOrderType,
  OrderNumberType,
} from '../../common/enums';
import { User } from '../../users/schemas/user.schema';
import { Prescription } from '../../prescriptions/schemas/prescription.schema';

export type WorkOrderDocument = HydratedDocument<WorkOrder>;

@Schema()
export class EyePrescription {
  @Prop()
  esfera: string;

  @Prop()
  cilindro: string;

  @Prop()
  grado: string;
}

const EyePrescriptionSchema = SchemaFactory.createForClass(EyePrescription);

@Schema()
export class PrescriptionDistance {
  @Prop({ type: EyePrescriptionSchema })
  od: EyePrescription;

  @Prop({ type: EyePrescriptionSchema })
  oi: EyePrescription;
}

const PrescriptionDistanceSchema =
  SchemaFactory.createForClass(PrescriptionDistance);

@Schema()
export class LensDetails {
  @Prop()
  dp: string;

  @Prop()
  cristal: string;

  @Prop()
  codigo: string;

  @Prop()
  color: string;

  @Prop()
  armazonMarca: string;
}

const LensDetailsSchema = SchemaFactory.createForClass(LensDetails);

@Schema()
export class MedicalPrescription {
  @Prop({ type: PrescriptionDistanceSchema })
  lejos: PrescriptionDistance;

  @Prop({ type: PrescriptionDistanceSchema })
  cerca: PrescriptionDistance;

  @Prop()
  add: string;

  @Prop({ type: LensDetailsSchema })
  detallesLejos: LensDetails;

  @Prop({ type: LensDetailsSchema })
  detallesCerca: LensDetails;
}

const MedicalPrescriptionSchema =
  SchemaFactory.createForClass(MedicalPrescription);

@Schema()
export class CustomerData {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  rut: string;

  @Prop()
  telefono: string;
}

const CustomerDataSchema = SchemaFactory.createForClass(CustomerData);

@Schema()
export class PurchaseData {
  @Prop({ required: true })
  totalVenta: number;

  @Prop({ required: true, default: 0 })
  abono: number;

  @Prop({ required: true })
  saldo: number;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  formaPago: PaymentMethod;

  @Prop()
  fechaEntrega: Date;
}

const PurchaseDataSchema = SchemaFactory.createForClass(PurchaseData);

@Schema({ timestamps: true })
export class WorkOrder {
  @Prop({ required: true, unique: true })
  numeroOrden: number;

  @Prop()
  numeroOrdenManual: string;

  @Prop({ type: String, enum: OrderNumberType, required: true })
  tipoNumeroOrden: OrderNumberType;

  @Prop({ type: String, enum: WorkOrderType, required: true })
  tipoOrden: WorkOrderType;

  @Prop({ type: CustomerDataSchema, required: true })
  cliente: CustomerData;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Prescription' })
  recetaId: Prescription;

  @Prop({ type: MedicalPrescriptionSchema })
  receta: MedicalPrescription;

  @Prop({ type: PurchaseDataSchema, required: true })
  compra: PurchaseData;

  @Prop({ required: true })
  fechaVenta: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creadoPor: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  actualizadoPor: User;

  @Prop()
  observaciones: string;
}

export const WorkOrderSchema = SchemaFactory.createForClass(WorkOrder);
