import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { AuthService } from '../../core/services/auth.service';
import { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderType, PaymentMethod } from '../../core/models';

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

  showModal = false;
  isEditing = false;
  selectedWorkOrder: WorkOrder | null = null;

  formData: CreateWorkOrderDto = this.getEmptyFormData();

  showDeleteConfirm = false;
  workOrderToDelete: WorkOrder | null = null;

  showDetailModal = false;
  detailWorkOrder: WorkOrder | null = null;

  private subscription = new Subscription();
  private workOrdersService = inject(WorkOrdersService);
  private authService = inject(AuthService);

  workOrderTypes: { value: WorkOrderType; label: string }[] = [
    { value: 'armazon', label: 'Armazón' },
    { value: 'lentes', label: 'Lentes' },
    { value: 'lente_completo', label: 'Lente Completo' }
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
      tipo: 'armazon',
      cliente: {
        nombre: '',
        rut: '',
        telefono: '',
        email: '',
        direccion: ''
      },
      receta: {
        ojoDerecho: {},
        ojoIzquierdo: {}
      },
      armazon: {
        marca: '',
        modelo: '',
        color: '',
        precio: 0
      },
      lentes: {
        tipo: '',
        material: '',
        tratamientos: [],
        precio: 0
      },
      abono: 0,
      total: 0,
      formaPago: 'efectivo',
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
      filtered = filtered.filter(order => order.tipo === this.filterType);
    }

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
      this.errorMessage = 'Solo los administradores pueden editar órdenes';
      return;
    }
    this.isEditing = true;
    this.selectedWorkOrder = order;
    this.formData = {
      tipo: order.tipo,
      cliente: { ...order.cliente },
      receta: order.receta ? {
        ojoDerecho: { ...order.receta.ojoDerecho },
        ojoIzquierdo: { ...order.receta.ojoIzquierdo }
      } : { ojoDerecho: {}, ojoIzquierdo: {} },
      armazon: order.armazon ? { ...order.armazon } : { marca: '', modelo: '', color: '', precio: 0 },
      lentes: order.lentes ? { ...order.lentes, tratamientos: [...(order.lentes.tratamientos || [])] } : { tipo: '', material: '', tratamientos: [], precio: 0 },
      abono: order.abono || 0,
      total: order.total || 0,
      formaPago: order.formaPago || 'efectivo',
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
    return this.formData.tipo === 'lentes' || this.formData.tipo === 'lente_completo';
  }

  calculateSaldo(): number {
    const total = this.formData.total || 0;
    const abono = this.formData.abono || 0;
    return total - abono;
  }
}
