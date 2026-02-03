import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';

@ApiTags('prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva receta medica' })
  @ApiResponse({ status: 201, description: 'Receta creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.prescriptionsService.create(createPrescriptionDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recetas medicas' })
  @ApiResponse({ status: 200, description: 'Lista de recetas' })
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar recetas con filtros' })
  @ApiQuery({ name: 'rut', required: false, description: 'RUT del cliente' })
  @ApiQuery({
    name: 'nombre',
    required: false,
    description: 'Nombre del cliente',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha desde (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha hasta (YYYY-MM-DD)',
  })
  @ApiResponse({ status: 200, description: 'Lista de recetas filtradas' })
  search(
    @Query('rut') rut?: string,
    @Query('nombre') nombre?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.prescriptionsService.search({
      rut,
      nombre,
      fechaDesde,
      fechaHasta,
    });
  }

  @Get('by-rut')
  @ApiOperation({ summary: 'Obtener recetas por RUT del cliente' })
  @ApiQuery({ name: 'rut', required: true, description: 'RUT del cliente' })
  @ApiResponse({ status: 200, description: 'Lista de recetas del cliente' })
  findByClientRut(@Query('rut') rut: string) {
    return this.prescriptionsService.findByClientRut(rut);
  }

  @Get('latest-by-rut')
  @ApiOperation({ summary: 'Obtener ultima receta por RUT del cliente' })
  @ApiQuery({ name: 'rut', required: true, description: 'RUT del cliente' })
  @ApiResponse({ status: 200, description: 'Ultima receta del cliente' })
  findLatestByClientRut(@Query('rut') rut: string) {
    return this.prescriptionsService.findLatestByClientRut(rut);
  }

  @Get('by-rut-and-type')
  @ApiOperation({ summary: 'Obtener recetas por RUT del cliente y tipo' })
  @ApiQuery({ name: 'rut', required: true, description: 'RUT del cliente' })
  @ApiQuery({
    name: 'tipo',
    required: true,
    description: 'Tipo de receta (lejos/cerca)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recetas del cliente por tipo',
  })
  findByClientRutAndType(
    @Query('rut') rut: string,
    @Query('tipo') tipo: string,
  ) {
    return this.prescriptionsService.findByClientRutAndType(rut, tipo);
  }

  @Get('latest-by-rut-and-type')
  @ApiOperation({ summary: 'Obtener ultima receta por RUT del cliente y tipo' })
  @ApiQuery({ name: 'rut', required: true, description: 'RUT del cliente' })
  @ApiQuery({
    name: 'tipo',
    required: true,
    description: 'Tipo de receta (lejos/cerca)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ultima receta del cliente por tipo',
  })
  findLatestByClientRutAndType(
    @Query('rut') rut: string,
    @Query('tipo') tipo: string,
  ) {
    return this.prescriptionsService.findLatestByClientRutAndType(rut, tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener receta por ID' })
  @ApiResponse({ status: 200, description: 'Receta encontrada' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar receta (solo admin)' })
  @ApiResponse({ status: 200, description: 'Receta actualizada' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.prescriptionsService.update(id, updatePrescriptionDto, userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar receta (solo admin)' })
  @ApiResponse({ status: 200, description: 'Receta eliminada' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(id);
  }
}
