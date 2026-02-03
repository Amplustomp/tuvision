import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true, unique: true })
  rut: string;

  @Prop({ required: true })
  nombre: string;

  @Prop()
  telefono: string;

  @Prop()
  email: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creadoPor: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  actualizadoPor: User;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.index({ nombre: 'text' });
