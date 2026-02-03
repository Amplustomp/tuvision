import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Prescription,
  PrescriptionDocument,
  EyeData,
} from './schemas/prescription.schema';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto';

export interface CreatePrescriptionResult {
  prescription: PrescriptionDocument;
  isNew: boolean;
  message?: string;
}

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<PrescriptionDocument>,
  ) {}

  private areEyeDataEqual(eye1?: EyeData, eye2?: EyeData): boolean {
    if (!eye1 && !eye2) return true;
    if (!eye1 || !eye2) return false;
    return (
      (eye1.esfera || '') === (eye2.esfera || '') &&
      (eye1.cilindro || '') === (eye2.cilindro || '') &&
      (eye1.eje || '') === (eye2.eje || '') &&
      (eye1.adicion || '') === (eye2.adicion || '')
    );
  }

  private arePrescriptionValuesEqual(
    newPrescription: CreatePrescriptionDto,
    existingPrescription: PrescriptionDocument,
  ): boolean {
    const odEqual = this.areEyeDataEqual(
      newPrescription.ojoDerecho as EyeData,
      existingPrescription.ojoDerecho,
    );
    const oiEqual = this.areEyeDataEqual(
      newPrescription.ojoIzquierdo as EyeData,
      existingPrescription.ojoIzquierdo,
    );
    const dpEqual =
      (newPrescription.distanciaPupilar || '') ===
      (existingPrescription.distanciaPupilar || '');

    return odEqual && oiEqual && dpEqual;
  }

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    userId: string,
  ): Promise<CreatePrescriptionResult> {
    const latestPrescription = await this.findLatestByClientRutAndType(
      createPrescriptionDto.clienteRut,
      createPrescriptionDto.tipo,
    );

    if (
      latestPrescription &&
      this.arePrescriptionValuesEqual(createPrescriptionDto, latestPrescription)
    ) {
      const updatedPrescription = await this.prescriptionModel
        .findByIdAndUpdate(
          latestPrescription._id,
          { actualizadoPor: userId },
          { new: true, timestamps: true },
        )
        .populate('creadoPor', 'nombre email')
        .populate('actualizadoPor', 'nombre email')
        .exec();

      return {
        prescription: updatedPrescription!,
        isNew: false,
        message:
          'La receta no presenta cambios respecto a la ultima conocida. Se actualizo la fecha.',
      };
    }

    const createdPrescription = new this.prescriptionModel({
      ...createPrescriptionDto,
      creadoPor: userId,
    });
    const savedPrescription = await createdPrescription.save();
    const populatedPrescription = await this.prescriptionModel
      .findById(savedPrescription._id)
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();

    return {
      prescription: populatedPrescription!,
      isNew: true,
    };
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

  async findLatestByClientRutAndType(
    rut: string,
    tipo: string,
  ): Promise<PrescriptionDocument | null> {
    return this.prescriptionModel
      .findOne({ clienteRut: rut, tipo })
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByClientRutAndType(
    rut: string,
    tipo: string,
  ): Promise<PrescriptionDocument[]> {
    return this.prescriptionModel
      .find({ clienteRut: rut, tipo })
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
