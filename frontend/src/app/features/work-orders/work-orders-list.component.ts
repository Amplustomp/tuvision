import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { AuthService } from '../../core/services/auth.service';
import { PrescriptionsService } from '../../core/services/prescriptions.service';
import { ClientsService } from '../../core/services/clients.service';
import { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderType, PaymentMethod, OrderNumberType, Prescription, Client, CreatePrescriptionDto, CreateClientDto } from '../../core/models';

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

    clients: Client[] = [];
    filteredClients: Client[] = [];
    selectedClient: Client | null = null;
    clientSearchTerm = '';
    showClientDropdown = false;
    isNewClient = false;

    clientPrescriptions: Prescription[] = [];
    selectedPrescriptionLejos: Prescription | null = null;
    selectedPrescriptionCerca: Prescription | null = null;
    showPrescriptionModal = false;
    prescriptionType: 'lejos' | 'cerca' = 'lejos';
    
    savingClient = false;
    clientSaveMessage = '';
    clientSaveError = '';

    showPrescriptionFormModal = false;
    prescriptionFormType: 'lejos' | 'cerca' = 'lejos';
    showExistingPrescriptionsList = false;
    savingPrescription = false;
    prescriptionSaveMessage = '';
    prescriptionSaveError = '';
    prescriptionFormData = {
      od: { esfera: '', cilindro: '', grado: '' },
      oi: { esfera: '', cilindro: '', grado: '' },
      add: '',
      dp: ''
    };

    private subscription = new Subscription();
    private workOrdersService = inject(WorkOrdersService);
    private authService = inject(AuthService);
    private prescriptionsService = inject(PrescriptionsService);
    private clientsService = inject(ClientsService);

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
      this.loadClients();
    }

    loadClients(): void {
      this.clientsService.getAll().subscribe({
        next: (clients) => {
          this.clients = clients;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
        }
      });
    }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clienteFormData = {
    nombre: '',
    rut: '',
    telefono: '',
    email: ''
  };

  private getEmptyFormData(): CreateWorkOrderDto {
    return {
      tipoNumeroOrden: 'tu_vision',
      tipoOrden: 'armazon',
      clienteId: '',
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
      filtered = filtered.filter(order => {
        const cliente = typeof order.clienteId === 'object' ? order.clienteId : null;
        return (cliente?.nombre?.toLowerCase().includes(term) ||
          cliente?.rut?.toLowerCase().includes(term) ||
          order.numeroOrden.toString().includes(term));
      });
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
    const cliente = typeof order.clienteId === 'object' ? order.clienteId : null;
    this.clienteFormData = {
      nombre: cliente?.nombre || '',
      rut: cliente?.rut || '',
      telefono: cliente?.telefono || '',
      email: cliente?.email || ''
    };
    if (cliente) {
      this.selectedClient = cliente;
      this.clientSearchTerm = cliente.nombre;
    }
    this.formData = {
      tipoNumeroOrden: order.tipoNumeroOrden,
      tipoOrden: order.tipoOrden,
      clienteId: typeof order.clienteId === 'string' ? order.clienteId : order.clienteId._id,
      recetaLejosId: typeof order.recetaLejosId === 'string' ? order.recetaLejosId : order.recetaLejosId?._id,
      recetaCercaId: typeof order.recetaCercaId === 'string' ? order.recetaCercaId : order.recetaCercaId?._id,
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

    if (!this.clienteFormData.nombre || !this.clienteFormData.rut) {
      this.errorMessage = 'El nombre y RUT del cliente son requeridos';
      return;
    }

    if (!this.formData.clienteId && !this.isNewClient) {
      this.errorMessage = 'Debe seleccionar un cliente existente o crear uno nuevo';
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
      if (this.isNewClient) {
        const clientData: CreateClientDto = {
          nombre: this.clienteFormData.nombre,
          rut: this.clienteFormData.rut,
          telefono: this.clienteFormData.telefono
        };
        this.clientsService.create(clientData).subscribe({
          next: (savedClient) => {
            this.formData.clienteId = savedClient._id;
            this.createWorkOrderAfterClient();
          },
          error: (error) => {
            if (error.status === 409) {
              this.clientsService.getByRut(this.clienteFormData.rut).subscribe({
                next: (existingClient) => {
                  if (existingClient) {
                    this.formData.clienteId = existingClient._id;
                    this.createWorkOrderAfterClient();
                  } else {
                    this.isLoading = false;
                    this.errorMessage = 'Error al obtener cliente existente';
                  }
                },
                error: () => {
                  this.isLoading = false;
                  this.errorMessage = 'Error al obtener cliente existente';
                }
              });
            } else {
              this.isLoading = false;
              this.errorMessage = error.error?.message || 'Error al crear cliente';
            }
          }
        });
      } else {
        this.createWorkOrderAfterClient();
      }
    }
  }

  private createWorkOrderAfterClient(): void {
    this.workOrdersService.create(this.formData).subscribe({
      next: () => {
        this.successMessage = 'Orden creada exitosamente';
        this.closeModal();
        this.loadWorkOrders();
        this.loadClients();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear orden';
      }
    });
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
    const rut = this.clienteFormData.rut;
    if (rut && rut.length >= 8) {
      this.loadLatestPrescription(rut);
      this.loadClientPrescriptions(rut);
    }
  }

  searchClients(): void {
    if (!this.clientSearchTerm || this.clientSearchTerm.length < 2) {
      this.filteredClients = [];
      return;
    }
    const term = this.clientSearchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(c =>
      c.nombre.toLowerCase().includes(term) ||
      c.rut.toLowerCase().includes(term) ||
      (c.telefono && c.telefono.includes(term))
    ).slice(0, 10);
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.formData.clienteId = client._id;
    this.clienteFormData = {
      nombre: client.nombre,
      rut: client.rut,
      telefono: client.telefono || '',
      email: client.email || ''
    };
    this.clientSearchTerm = client.nombre;
    this.showClientDropdown = false;
    this.isNewClient = false;
    this.loadClientPrescriptions(client.rut);
  }

  clearClientSelection(): void {
    this.selectedClient = null;
    this.clientSearchTerm = '';
    this.formData.clienteId = '';
    this.clienteFormData = { nombre: '', rut: '', telefono: '', email: '' };
    this.clientPrescriptions = [];
    this.selectedPrescriptionLejos = null;
    this.selectedPrescriptionCerca = null;
  }

  toggleNewClient(): void {
    this.isNewClient = !this.isNewClient;
    if (this.isNewClient) {
      this.selectedClient = null;
      this.clientSearchTerm = '';
    }
    this.clientSaveMessage = '';
    this.clientSaveError = '';
  }

  saveNewClient(): void {
    if (!this.clienteFormData.nombre || !this.clienteFormData.rut) {
      this.clientSaveError = 'Nombre y RUT son obligatorios';
      return;
    }

    this.savingClient = true;
    this.clientSaveMessage = '';
    this.clientSaveError = '';

    const clientData = {
      nombre: this.clienteFormData.nombre,
      rut: this.clienteFormData.rut,
      telefono: this.clienteFormData.telefono || '',
      email: this.clienteFormData.email || ''
    };

    this.clientsService.create(clientData).subscribe({
      next: (savedClient) => {
        this.savingClient = false;
        this.clientSaveMessage = 'Cliente guardado exitosamente';
        this.selectedClient = savedClient;
        this.formData.clienteId = savedClient._id;
        this.isNewClient = false;
        this.loadClients();
        this.loadClientPrescriptions(savedClient.rut);
      },
      error: (error) => {
        this.savingClient = false;
        this.clientSaveError = error.error?.message || 'Error al guardar el cliente';
      }
    });
  }

  loadClientPrescriptions(rut: string): void {
    if (!rut) return;
    this.prescriptionsService.getByClientRut(rut).subscribe({
      next: (prescriptions) => {
        this.clientPrescriptions = prescriptions;
      },
      error: () => {
        this.clientPrescriptions = [];
      }
    });
  }

  openPrescriptionModal(type: 'lejos' | 'cerca'): void {
    this.prescriptionType = type;
    this.showPrescriptionModal = true;
  }

  closePrescriptionModal(): void {
    this.showPrescriptionModal = false;
  }

  savePrescriptionFromForm(type: 'lejos' | 'cerca'): void {
    if (!this.clienteFormData.rut || !this.clienteFormData.nombre) {
      this.errorMessage = 'Debe ingresar los datos del cliente primero';
      return;
    }

    const recetaData = type === 'lejos' ? this.formData.receta?.lejos : this.formData.receta?.cerca;
    const detalles = type === 'lejos' ? this.formData.receta?.detallesLejos : this.formData.receta?.detallesCerca;

    if (!recetaData?.od?.esfera && !recetaData?.oi?.esfera) {
      this.errorMessage = 'Debe ingresar al menos los datos de esfera para guardar la receta';
      return;
    }

    const prescriptionData: CreatePrescriptionDto = {
      clienteRut: this.clienteFormData.rut,
      clienteNombre: this.clienteFormData.nombre,
      clienteTelefono: this.clienteFormData.telefono,
      tipo: type,
      ojoDerecho: recetaData?.od ? {
        esfera: recetaData.od.esfera,
        cilindro: recetaData.od.cilindro,
        eje: recetaData.od.grado
      } : undefined,
      ojoIzquierdo: recetaData?.oi ? {
        esfera: recetaData.oi.esfera,
        cilindro: recetaData.oi.cilindro,
        eje: recetaData.oi.grado
      } : undefined,
      distanciaPupilar: detalles?.dp,
      observaciones: type === 'lejos' ? 'Receta Lejos' : 'Receta Cerca'
    };

    this.isLoading = true;
    this.prescriptionsService.create(prescriptionData).subscribe({
      next: (result) => {
        this.isLoading = false;
        const prescription = 'prescription' in result ? result.prescription : result;
        this.successMessage = `Receta ${type === 'lejos' ? 'Lejos' : 'Cerca'} guardada exitosamente`;
        if (type === 'lejos') {
          this.formData.recetaLejosId = prescription._id;
          this.selectedPrescriptionLejos = prescription;
        } else {
          this.formData.recetaCercaId = prescription._id;
          this.selectedPrescriptionCerca = prescription;
        }
        this.loadClientPrescriptions(this.clienteFormData.rut);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al guardar la receta';
      }
    });
  }

  selectExistingPrescription(prescription: Prescription): void {
    if (this.prescriptionFormType === 'lejos') {
      this.selectedPrescriptionLejos = prescription;
      this.formData.recetaLejosId = prescription._id;
      this.prescriptionFormData.od = {
        esfera: prescription.ojoDerecho?.esfera || '',
        cilindro: prescription.ojoDerecho?.cilindro || '',
        grado: prescription.ojoDerecho?.eje || ''
      };
      this.prescriptionFormData.oi = {
        esfera: prescription.ojoIzquierdo?.esfera || '',
        cilindro: prescription.ojoIzquierdo?.cilindro || '',
        grado: prescription.ojoIzquierdo?.eje || ''
      };
      this.prescriptionFormData.dp = prescription.distanciaPupilar || '';
    } else {
      this.selectedPrescriptionCerca = prescription;
      this.formData.recetaCercaId = prescription._id;
      this.prescriptionFormData.od = {
        esfera: prescription.ojoDerecho?.esfera || '',
        cilindro: prescription.ojoDerecho?.cilindro || '',
        grado: prescription.ojoDerecho?.eje || ''
      };
      this.prescriptionFormData.oi = {
        esfera: prescription.ojoIzquierdo?.esfera || '',
        cilindro: prescription.ojoIzquierdo?.cilindro || '',
        grado: prescription.ojoIzquierdo?.eje || ''
      };
      this.prescriptionFormData.add = prescription.ojoDerecho?.adicion || '';
      this.prescriptionFormData.dp = prescription.distanciaPupilar || '';
    }
    this.showExistingPrescriptionsList = false;
    this.prescriptionSaveMessage = 'Receta cargada exitosamente';
  }

  openPrescriptionFormModal(type: 'lejos' | 'cerca'): void {
    this.prescriptionFormType = type;
    this.showPrescriptionFormModal = true;
    this.showExistingPrescriptionsList = false;
    this.prescriptionSaveMessage = '';
    this.prescriptionSaveError = '';
    this.resetPrescriptionFormData();
    
    if (this.clienteFormData.rut) {
      this.loadClientPrescriptions(this.clienteFormData.rut);
    }
  }

  closePrescriptionFormModal(): void {
    this.showPrescriptionFormModal = false;
    this.showExistingPrescriptionsList = false;
  }

  resetPrescriptionFormData(): void {
    this.prescriptionFormData = {
      od: { esfera: '', cilindro: '', grado: '' },
      oi: { esfera: '', cilindro: '', grado: '' },
      add: '',
      dp: ''
    };
  }

  showExistingPrescriptions(): void {
    this.showExistingPrescriptionsList = true;
  }

  hideExistingPrescriptions(): void {
    this.showExistingPrescriptionsList = false;
  }

  savePrescriptionFromModal(): void {
    if (!this.clienteFormData.rut || !this.clienteFormData.nombre) {
      this.prescriptionSaveError = 'Debe ingresar los datos del cliente primero';
      return;
    }

    if (!this.prescriptionFormData.od.esfera && !this.prescriptionFormData.oi.esfera) {
      this.prescriptionSaveError = 'Debe ingresar al menos los datos de esfera para guardar la receta';
      return;
    }

    const prescriptionData: CreatePrescriptionDto = {
      clienteRut: this.clienteFormData.rut,
      clienteNombre: this.clienteFormData.nombre,
      clienteTelefono: this.clienteFormData.telefono,
      tipo: this.prescriptionFormType,
      ojoDerecho: this.prescriptionFormData.od.esfera ? {
        esfera: this.prescriptionFormData.od.esfera,
        cilindro: this.prescriptionFormData.od.cilindro,
        eje: this.prescriptionFormData.od.grado,
        adicion: this.prescriptionFormType === 'cerca' ? this.prescriptionFormData.add : undefined
      } : undefined,
      ojoIzquierdo: this.prescriptionFormData.oi.esfera ? {
        esfera: this.prescriptionFormData.oi.esfera,
        cilindro: this.prescriptionFormData.oi.cilindro,
        eje: this.prescriptionFormData.oi.grado
      } : undefined,
      distanciaPupilar: this.prescriptionFormData.dp,
      observaciones: this.prescriptionFormType === 'lejos' ? 'Receta Lejos' : 'Receta Cerca'
    };

    this.savingPrescription = true;
    this.prescriptionSaveMessage = '';
    this.prescriptionSaveError = '';

    this.prescriptionsService.create(prescriptionData).subscribe({
      next: (result) => {
        this.savingPrescription = false;
        const prescription = 'prescription' in result ? result.prescription : result;
        this.prescriptionSaveMessage = `Receta ${this.prescriptionFormType === 'lejos' ? 'Lejos' : 'Cerca'} guardada exitosamente`;
        if (this.prescriptionFormType === 'lejos') {
          this.formData.recetaLejosId = prescription._id;
          this.selectedPrescriptionLejos = prescription;
        } else {
          this.formData.recetaCercaId = prescription._id;
          this.selectedPrescriptionCerca = prescription;
        }
        this.loadClientPrescriptions(this.clienteFormData.rut);
      },
      error: (error) => {
        this.savingPrescription = false;
        this.prescriptionSaveError = error.error?.message || 'Error al guardar la receta';
      }
    });
  }

  getDisplayOrderNumber(order: WorkOrder): string {
    if (order.numeroOrdenManual) {
      return order.numeroOrdenManual;
    }
    return `#${order.numeroOrden}`;
  }

  getClientName(order: WorkOrder): string {
    if (typeof order.clienteId === 'object' && order.clienteId) {
      return order.clienteId.nombre || '-';
    }
    return '-';
  }

  getClientRut(order: WorkOrder): string {
    if (typeof order.clienteId === 'object' && order.clienteId) {
      return order.clienteId.rut || '-';
    }
    return '-';
  }

  getClientPhone(order: WorkOrder): string {
    if (typeof order.clienteId === 'object' && order.clienteId) {
      return order.clienteId.telefono || '-';
    }
    return '-';
  }
}
