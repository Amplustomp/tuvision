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
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un cliente con este RUT',
  })
  create(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.create(createClientDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar clientes por RUT, nombre o email' })
  @ApiQuery({ name: 'rut', required: false })
  @ApiQuery({ name: 'nombre', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  search(
    @Query('rut') rut?: string,
    @Query('nombre') nombre?: string,
    @Query('email') email?: string,
  ) {
    return this.clientsService.search({ rut, nombre, email });
  }

  @Get('by-rut/:rut')
  @ApiOperation({ summary: 'Obtener cliente por RUT' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByRut(@Param('rut') rut: string) {
    return this.clientsService.findByRut(rut);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar cliente (solo admin)' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.update(id, updateClientDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar cliente (solo admin)' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  @Post('find-or-create')
  @ApiOperation({ summary: 'Buscar cliente por RUT o crear si no existe' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado o creado' })
  findOrCreate(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.findOrCreate(createClientDto, user);
  }
}
