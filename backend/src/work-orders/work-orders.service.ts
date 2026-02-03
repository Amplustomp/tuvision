import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkOrder, WorkOrderDocument } from './schemas/work-order.schema';
import { CreateWorkOrderDto, UpdateWorkOrderDto } from './dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectModel(WorkOrder.name)
    private workOrderModel: Model<WorkOrderDocument>,
  ) {}

  private async getNextOrderNumber(): Promise<number> {
    const lastOrder = await this.workOrderModel
      .findOne()
      .sort({ numeroOrden: -1 })
      .exec();
    return lastOrder ? lastOrder.numeroOrden + 1 : 1;
  }

  async create(
    createWorkOrderDto: CreateWorkOrderDto,
    userId: string,
  ): Promise<WorkOrderDocument> {
    const numeroOrden = await this.getNextOrderNumber();
    const createdWorkOrder = new this.workOrderModel({
      ...createWorkOrderDto,
      numeroOrden,
      creadoPor: userId,
    });
    const savedWorkOrder = await createdWorkOrder.save();
    return this.findOne(savedWorkOrder._id.toString());
  }

  async findAll(): Promise<WorkOrderDocument[]> {
    return this.workOrderModel
      .find()
      .populate('clienteId', 'nombre rut telefono email')
      .populate('recetaLejosId')
      .populate('recetaCercaId')
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<WorkOrderDocument> {
    const workOrder = await this.workOrderModel
      .findById(id)
      .populate('clienteId', 'nombre rut telefono email')
      .populate('recetaLejosId')
      .populate('recetaCercaId')
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();
    if (!workOrder) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }
    return workOrder;
  }

  async findByOrderNumber(numeroOrden: number): Promise<WorkOrderDocument> {
    const workOrder = await this.workOrderModel
      .findOne({ numeroOrden })
      .populate('clienteId', 'nombre rut telefono email')
      .populate('recetaLejosId')
      .populate('recetaCercaId')
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();
    if (!workOrder) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }
    return workOrder;
  }

  async update(
    id: string,
    updateWorkOrderDto: UpdateWorkOrderDto,
    userId: string,
  ): Promise<WorkOrderDocument> {
    const updatedWorkOrder = await this.workOrderModel
      .findByIdAndUpdate(
        id,
        { ...updateWorkOrderDto, actualizadoPor: userId },
        { new: true },
      )
      .populate('clienteId', 'nombre rut telefono email')
      .populate('recetaLejosId')
      .populate('recetaCercaId')
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .exec();

    if (!updatedWorkOrder) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }
    return updatedWorkOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.workOrderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }
  }

  async findByClientId(clienteId: string): Promise<WorkOrderDocument[]> {
    return this.workOrderModel
      .find({ clienteId: new Types.ObjectId(clienteId) } as any)
      .populate('clienteId', 'nombre rut telefono email')
      .populate('recetaLejosId')
      .populate('recetaCercaId')
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
