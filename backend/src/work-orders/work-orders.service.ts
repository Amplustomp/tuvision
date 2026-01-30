import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return createdWorkOrder.save();
  }

  async findAll(): Promise<WorkOrderDocument[]> {
    return this.workOrderModel
      .find()
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<WorkOrderDocument> {
    const workOrder = await this.workOrderModel
      .findById(id)
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

  async findByCustomerRut(rut: string): Promise<WorkOrderDocument[]> {
    return this.workOrderModel
      .find({ 'cliente.rut': rut })
      .populate('creadoPor', 'nombre email')
      .populate('actualizadoPor', 'nombre email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
