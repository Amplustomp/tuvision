import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';

@ApiTags('work-orders')
@ApiBearerAuth('JWT-auth')
@Controller('work-orders')
@UseGuards(JwtAuthGuard)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear orden de trabajo',
    description: 'Crea una nueva orden de trabajo',
  })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() createWorkOrderDto: CreateWorkOrderDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.workOrdersService.create(createWorkOrderDto, user.userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar órdenes',
    description: 'Obtiene todas las órdenes de trabajo',
  })
  @ApiResponse({ status: 200, description: 'Lista de órdenes de trabajo' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.workOrdersService.findAll();
  }

  @Get('by-client/:clienteId')
  @ApiOperation({
    summary: 'Buscar por cliente',
    description: 'Busca órdenes de trabajo por ID del cliente',
  })
  @ApiParam({
    name: 'clienteId',
    description: 'ID del cliente',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({ status: 200, description: 'Órdenes encontradas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByClientId(@Param('clienteId') clienteId: string) {
    return this.workOrdersService.findByClientId(clienteId);
  }

  @Get('by-number/:numeroOrden')
  @ApiOperation({
    summary: 'Buscar por número',
    description: 'Busca una orden de trabajo por su número',
  })
  @ApiParam({
    name: 'numeroOrden',
    description: 'Número de la orden',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findByOrderNumber(@Param('numeroOrden') numeroOrden: string) {
    return this.workOrdersService.findByOrderNumber(parseInt(numeroOrden, 10));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener orden',
    description: 'Obtiene una orden de trabajo por ID',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Actualizar orden',
    description: 'Actualiza una orden de trabajo (solo administradores)',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores',
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.workOrdersService.update(id, updateWorkOrderDto, user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Eliminar orden',
    description: 'Elimina una orden de trabajo (solo administradores)',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({ status: 200, description: 'Orden eliminada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores',
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  remove(@Param('id') id: string) {
    return this.workOrdersService.remove(id);
  }
}
