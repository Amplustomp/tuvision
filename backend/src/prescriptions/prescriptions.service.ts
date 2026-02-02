import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Prescription,
  PrescriptionDocument,
} from './schemas/prescription.schema';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    userId: string,
  ): Promise<PrescriptionDocument> {
    const createdPrescription = new this.prescriptionModel({
      ...createPrescriptionDto,
      creadoPor: userId,
    });
    return createdPrescription.save();
  }

  async findAll(): Promise<PrescriptionDocument[]> {
    return this.prescriptionModel
      .find()
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<PrescriptionDocument> {
    const prescription = await this.prescriptionModel
      .findById(id)
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();
    if (!prescription) {
      throw new NotFoundException('Receta medica no encontrada');
    }
    return prescription;
  }

  async findByClientRut(rut: string): Promise<PrescriptionDocument[]> {
    return this.prescriptionModel
      .find({ clienteRut: rut })
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findLatestByClientRut(
    rut: string,
  ): Promise<PrescriptionDocument | null> {
    return this.prescriptionModel
      .findOne({ clienteRut: rut })
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updatePrescriptionDto: UpdatePrescriptionDto,
    userId: string,
  ): Promise<PrescriptionDocument> {
    const updatedPrescription = await this.prescriptionModel
      .findByIdAndUpdate(
        id,
        { ...updatePrescriptionDto, actualizadoPor: userId },
        { new: true },
      )
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();

    if (!updatedPrescription) {
      throw new NotFoundException('Receta medica no encontrada');
    }
    return updatedPrescription;
  }

  async remove(id: string): Promise<void> {
    const result = await this.prescriptionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Receta medica no encontrada');
    }
  }

  async search(filters: {
    rut?: string;
    nombre?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<PrescriptionDocument[]> {
    const query: Record<string, unknown> = {};

    if (filters.rut) {
      query.clienteRut = { $regex: filters.rut, $options: 'i' };
    }

    if (filters.nombre) {
      query.clienteNombre = { $regex: filters.nombre, $options: 'i' };
    }

    if (filters.fechaDesde || filters.fechaHasta) {
      query.createdAt = {};
      if (filters.fechaDesde) {
        (query.createdAt as Record<string, unknown>).$gte = new Date(
          filters.fechaDesde,
        );
      }
      if (filters.fechaHasta) {
        (query.createdAt as Record<string, unknown>).$lte = new Date(
          filters.fechaHasta,
        );
      }
    }

    return this.prescriptionModel
      .find(query)
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
