import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { AuthService } from '../../core/services/auth.service';
import { PrescriptionsService } from '../../core/services/prescriptions.service';
import { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderType, PaymentMethod, OrderNumberType, Prescription } from '../../core/models';

@Component({
  selector: 'app-work-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-orders-list.component.html',
  styleUrl: './work-orders-list.component.scss'
})
export class WorkOrdersListComponent implements OnInit, OnDestroy {
  workOrders: WorkOrder[] = [];
  filteredWorkOrders: WorkOrder[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isAdmin = false;

  searchTerm = '';
  filterType: WorkOrderType | '' = '';
  filterOrderNumberType: OrderNumberType | '' = '';

  showModal = false;
  isEditing = false;
  selectedWorkOrder: WorkOrder | null = null;

  formData: CreateWorkOrderDto = this.getEmptyFormData();

  showDeleteConfirm = false;
  workOrderToDelete: WorkOrder | null = null;

  showDetailModal = false;
  detailWorkOrder: WorkOrder | null = null;

  latestPrescription: Prescription | null = null;

  private subscription = new Subscription();
  private workOrdersService = inject(WorkOrdersService);
  private authService = inject(AuthService);
  private prescriptionsService = inject(PrescriptionsService);

  workOrderTypes: { value: WorkOrderType; label: string }[] = [
    { value: 'armazon', label: 'Armazon' },
    { value: 'lentes', label: 'Lentes' },
    { value: 'lente_completo', label: 'Lente Completo' }
  ];

  orderNumberTypes: { value: OrderNumberType; label: string }[] = [
    { value: 'tu_vision', label: 'Tu Vision' },
    { value: 'opticolors', label: 'Opticolors' },
    { value: 'optiva_vr', label: 'Optiva VR' }
  ];

  paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'tarjeta', label: 'Tarjeta' }
  ];

  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.isAdmin = user?.role === 'admin';
      })
    );
    this.loadWorkOrders();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getEmptyFormData(): CreateWorkOrderDto {
    return {
      tipoNumeroOrden: 'tu_vision',
      tipoOrden: 'armazon',
      cliente: {
        nombre: '',
        rut: '',
        telefono: ''
      },
      receta: {
        lejos: { od: {}, oi: {} },
        cerca: { od: {}, oi: {} },
        add: '',
        detallesLejos: { dp: '', cristal: '', codigo: '', color: '', armazonMarca: '' },
        detallesCerca: { dp: '', cristal: '', codigo: '', color: '', armazonMarca: '' }
      },
      compra: {
        totalVenta: 0,
        abono: 0,
        saldo: 0,
        formaPago: 'efectivo',
        fechaEntrega: ''
      },
      fechaVenta: new Date().toISOString().split('T')[0],
      observaciones: ''
    };
  }

  loadWorkOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.workOrdersService.getAll().subscribe({
      next: (orders) => {
        this.workOrders = orders;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar órdenes de trabajo';
        this.isLoading = false;
        console.error('Error loading work orders:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.workOrders];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.cliente.nombre.toLowerCase().includes(term) ||
        order.cliente.rut.toLowerCase().includes(term) ||
        order.numeroOrden.toString().includes(term)
      );
    }

    if (this.filterType) {
      filtered = filtered.filter(order => order.tipoOrden === this.filterType);
    }

    if (this.filterOrderNumberType) {
      filtered = filtered.filter(order => order.tipoNumeroOrden === this.filterOrderNumberType);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this.filteredWorkOrders = filtered;
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedWorkOrder = null;
    this.formData = this.getEmptyFormData();
    this.showModal = true;
  }

  openEditModal(order: WorkOrder): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Solo los administradores pueden editar ordenes';
      return;
    }
    this.isEditing = true;
    this.selectedWorkOrder = order;
    this.formData = {
      tipoNumeroOrden: order.tipoNumeroOrden,
      tipoOrden: order.tipoOrden,
      cliente: { ...order.cliente },
      recetaId: order.recetaId,
      receta: order.receta ? {
        lejos: order.receta.lejos ? {
          od: order.receta.lejos.od ? { ...order.receta.lejos.od } : {},
          oi: order.receta.lejos.oi ? { ...order.receta.lejos.oi } : {}
        } : { od: {}, oi: {} },
        cerca: order.receta.cerca ? {
          od: order.receta.cerca.od ? { ...order.receta.cerca.od } : {},
          oi: order.receta.cerca.oi ? { ...order.receta.cerca.oi } : {}
        } : { od: {}, oi: {} },
        add: order.receta.add || '',
        detallesLejos: order.receta.detallesLejos ? { ...order.receta.detallesLejos } : { dp: '', cristal: '', codigo: '', color: '', armazonMarca: '' },
        detallesCerca: order.receta.detallesCerca ? { ...order.receta.detallesCerca } : { dp: '', cristal: '', codigo: '', color: '', armazonMarca: '' }
      } : this.getEmptyFormData().receta,
      compra: { ...order.compra },
      fechaVenta: order.fechaVenta,
      observaciones: order.observaciones || ''
    };
    this.showModal = true;
  }

  openDetailModal(order: WorkOrder): void {
    this.detailWorkOrder = order;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.detailWorkOrder = null;
    this.showDetailModal = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedWorkOrder = null;
    this.errorMessage = '';
  }

  saveWorkOrder(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.cliente.nombre || !this.formData.cliente.rut) {
      this.errorMessage = 'El nombre y RUT del cliente son requeridos';
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.selectedWorkOrder) {
      const updateData: UpdateWorkOrderDto = { ...this.formData };
      this.workOrdersService.update(this.selectedWorkOrder._id, updateData).subscribe({
        next: () => {
          this.successMessage = 'Orden actualizada exitosamente';
          this.closeModal();
          this.loadWorkOrders();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar orden';
        }
      });
    } else {
      this.workOrdersService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Orden creada exitosamente';
          this.closeModal();
          this.loadWorkOrders();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear orden';
        }
      });
    }
  }

  confirmDelete(order: WorkOrder): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Solo los administradores pueden eliminar órdenes';
      return;
    }
    this.workOrderToDelete = order;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.workOrderToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteWorkOrder(): void {
    if (!this.workOrderToDelete || !this.isAdmin) return;

    this.isLoading = true;
    this.workOrdersService.delete(this.workOrderToDelete._id).subscribe({
      next: () => {
        this.successMessage = 'Orden eliminada exitosamente';
        this.cancelDelete();
        this.loadWorkOrders();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al eliminar orden';
        this.cancelDelete();
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  getTypeLabel(type: WorkOrderType): string {
    const found = this.workOrderTypes.find(t => t.value === type);
    return found ? found.label : type;
  }

  getPaymentLabel(method: PaymentMethod | undefined): string {
    if (!method) return '-';
    const found = this.paymentMethods.find(m => m.value === method);
    return found ? found.label : method;
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  requiresReceta(): boolean {
    return this.formData.tipoOrden === 'lentes' || this.formData.tipoOrden === 'lente_completo';
  }

  calculateSaldo(): number {
    const total = this.formData.compra?.totalVenta || 0;
    const abono = this.formData.compra?.abono || 0;
    return total - abono;
  }

  getOrderNumberTypeLabel(type: OrderNumberType): string {
    const found = this.orderNumberTypes.find(t => t.value === type);
    return found ? found.label : type;
  }

  loadLatestPrescription(rut: string): void {
    if (!rut) return;
    this.prescriptionsService.getLatestByClientRut(rut).subscribe({
      next: (prescription) => {
        this.latestPrescription = prescription;
      },
      error: () => {
        this.latestPrescription = null;
      }
    });
  }

  onClientRutChange(): void {
    const rut = this.formData.cliente?.rut;
    if (rut && rut.length >= 8) {
      this.loadLatestPrescription(rut);
    }
  }
}
