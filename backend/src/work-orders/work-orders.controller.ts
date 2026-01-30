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
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums';

@Controller('work-orders')
@UseGuards(JwtAuthGuard)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  create(
    @Body() createWorkOrderDto: CreateWorkOrderDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.workOrdersService.create(createWorkOrderDto, user.userId);
  }

  @Get()
  findAll() {
    return this.workOrdersService.findAll();
  }

  @Get('by-rut')
  findByCustomerRut(@Query('rut') rut: string) {
    return this.workOrdersService.findByCustomerRut(rut);
  }

  @Get('by-number/:numeroOrden')
  findByOrderNumber(@Param('numeroOrden') numeroOrden: string) {
    return this.workOrdersService.findByOrderNumber(parseInt(numeroOrden, 10));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Patch(':id')
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
  remove(@Param('id') id: string) {
    return this.workOrdersService.remove(id);
  }
}
