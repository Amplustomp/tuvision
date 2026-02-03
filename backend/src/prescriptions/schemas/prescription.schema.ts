import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { PrescriptionType } from '../../common/enums';

export type PrescriptionDocument = HydratedDocument<Prescription>;

@Schema()
export class EyeData {
  @Prop()
  esfera: string;

  @Prop()
  cilindro: string;

  @Prop()
  eje: string;

  @Prop()
  adicion: string;
}

const EyeDataSchema = SchemaFactory.createForClass(EyeData);

@Schema({ timestamps: true })
export class Prescription {
  @Prop({ required: true })
  clienteRut: string;

  @Prop({ required: true })
  clienteNombre: string;

  @Prop()
  clienteTelefono: string;

  @Prop({ type: String, enum: PrescriptionType, required: true })
  tipo: PrescriptionType;

  @Prop({ type: EyeDataSchema })
  ojoDerecho: EyeData;

  @Prop({ type: EyeDataSchema })
  ojoIzquierdo: EyeData;

  @Prop()
  distanciaPupilar: string;

  @Prop()
  observaciones: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creadoPor: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  actualizadoPor: User;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);

PrescriptionSchema.index({ clienteRut: 1 });
PrescriptionSchema.index({ clienteRut: 1, tipo: 1 });
PrescriptionSchema.index({ createdAt: -1 });
