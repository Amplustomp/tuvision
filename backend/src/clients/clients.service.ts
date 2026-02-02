import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto, UpdateClientDto } from './dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async create(createClientDto: CreateClientDto, user: User): Promise<Client> {
    const existingClient = await this.clientModel.findOne({
      rut: createClientDto.rut,
    });
    if (existingClient) {
      throw new ConflictException('Ya existe un cliente con este RUT');
    }

    const client = new this.clientModel({
      ...createClientDto,
      creadoPor: user,
    });
    return client.save();
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel
      .find()
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel
      .findById(id)
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return client;
  }

  async findByRut(rut: string): Promise<Client | null> {
    return this.clientModel
      .findOne({ rut })
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();
  }

  async search(params: {
    rut?: string;
    nombre?: string;
    email?: string;
  }): Promise<Client[]> {
    const query: Record<string, unknown> = {};

    if (params.rut) {
      query.rut = { $regex: params.rut, $options: 'i' };
    }
    if (params.nombre) {
      query.nombre = { $regex: params.nombre, $options: 'i' };
    }
    if (params.email) {
      query.email = { $regex: params.email, $options: 'i' };
    }

    return this.clientModel
      .find(query)
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    user: User,
  ): Promise<Client> {
    const client = await this.clientModel
      .findByIdAndUpdate(
        id,
        { ...updateClientDto, actualizadoPor: user },
        { new: true },
      )
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return client;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Cliente no encontrado');
    }
  }

  async findOrCreate(
    createClientDto: CreateClientDto,
    user: User,
  ): Promise<Client> {
    const existingClient = await this.findByRut(createClientDto.rut);
    if (existingClient) {
      return existingClient;
    }
    return this.create(createClientDto, user);
  }
}
