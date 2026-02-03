import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PrescriptionsService } from '../../core/services/prescriptions.service';
import { AuthService } from '../../core/services/auth.service';
import { Prescription, CreatePrescriptionDto, UpdatePrescriptionDto, EyeData, PrescriptionType } from '../../core/models';

export interface ClientPrescriptions {
  clienteRut: string;
  clienteNombre: string;
  clienteTelefono?: string;
  prescriptionsLejos: Prescription[];
  prescriptionsCerca: Prescription[];
  latestDate: string;
  expandedLejos: boolean;
  expandedCerca: boolean;
}

@Component({
  selector: 'app-prescriptions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescriptions-list.component.html',
  styleUrl: './prescriptions-list.component.scss'
})
export class PrescriptionsListComponent implements OnInit, OnDestroy {
  prescriptions: Prescription[] = [];
  filteredPrescriptions: Prescription[] = [];
  groupedByClient: ClientPrescriptions[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isAdmin = false;

  searchRut = '';
  searchNombre = '';
  searchFechaDesde = '';
  searchFechaHasta = '';

  showModal = false;
  isEditing = false;
  selectedPrescription: Prescription | null = null;

  formData: CreatePrescriptionDto = this.getEmptyFormData();

  showDeleteConfirm = false;
  prescriptionToDelete: Prescription | null = null;

  showDetailModal = false;
  detailPrescription: Prescription | null = null;

  private subscription = new Subscription();
  private prescriptionsService = inject(PrescriptionsService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.isAdmin = user?.role === 'admin';
      })
    );
    this.loadPrescriptions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getEmptyFormData(): CreatePrescriptionDto {
    return {
      clienteRut: '',
      clienteNombre: '',
      clienteTelefono: '',
      tipo: 'lejos' as PrescriptionType,
      ojoDerecho: {
        esfera: '',
        cilindro: '',
        eje: '',
        adicion: ''
      },
      ojoIzquierdo: {
        esfera: '',
        cilindro: '',
        eje: '',
        adicion: ''
      },
      distanciaPupilar: '',
      observaciones: ''
    };
  }

  loadPrescriptions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.prescriptionsService.getAll().subscribe({
      next: (prescriptions) => {
        this.prescriptions = prescriptions;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar recetas medicas';
        this.isLoading = false;
        console.error('Error loading prescriptions:', error);
      }
    });
  }

  applyFilters(): void {
    if (!this.searchRut && !this.searchNombre && !this.searchFechaDesde && !this.searchFechaHasta) {
      this.filteredPrescriptions = [...this.prescriptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.groupPrescriptionsByClient();
      return;
    }

    this.isLoading = true;
    this.prescriptionsService.search({
      rut: this.searchRut || undefined,
      nombre: this.searchNombre || undefined,
      fechaDesde: this.searchFechaDesde || undefined,
      fechaHasta: this.searchFechaHasta || undefined
    }).subscribe({
      next: (prescriptions) => {
        this.filteredPrescriptions = prescriptions;
        this.groupPrescriptionsByClient();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al buscar recetas';
        this.isLoading = false;
        console.error('Error searching prescriptions:', error);
      }
    });
  }

  private groupPrescriptionsByClient(): void {
    const clientMap = new Map<string, ClientPrescriptions>();

    for (const prescription of this.filteredPrescriptions) {
      const rut = prescription.clienteRut;
      
      if (!clientMap.has(rut)) {
        clientMap.set(rut, {
          clienteRut: rut,
          clienteNombre: prescription.clienteNombre,
          clienteTelefono: prescription.clienteTelefono,
          prescriptionsLejos: [],
          prescriptionsCerca: [],
          latestDate: prescription.createdAt,
          expandedLejos: false,
          expandedCerca: false
        });
      }

      const clientData = clientMap.get(rut)!;
      
      if (prescription.tipo === 'lejos') {
        clientData.prescriptionsLejos.push(prescription);
      } else {
        clientData.prescriptionsCerca.push(prescription);
      }

      if (new Date(prescription.createdAt) > new Date(clientData.latestDate)) {
        clientData.latestDate = prescription.createdAt;
        clientData.clienteNombre = prescription.clienteNombre;
        clientData.clienteTelefono = prescription.clienteTelefono;
      }
    }

    for (const clientData of clientMap.values()) {
      clientData.prescriptionsLejos.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      clientData.prescriptionsCerca.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    this.groupedByClient = Array.from(clientMap.values()).sort(
      (a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
    );
  }

  toggleExpandLejos(client: ClientPrescriptions): void {
    client.expandedLejos = !client.expandedLejos;
  }

  toggleExpandCerca(client: ClientPrescriptions): void {
    client.expandedCerca = !client.expandedCerca;
  }

  clearFilters(): void {
    this.searchRut = '';
    this.searchNombre = '';
    this.searchFechaDesde = '';
    this.searchFechaHasta = '';
    this.applyFilters();
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedPrescription = null;
    this.formData = this.getEmptyFormData();
    this.showModal = true;
  }

  openEditModal(prescription: Prescription): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Solo los administradores pueden editar recetas';
      return;
    }
    this.isEditing = true;
    this.selectedPrescription = prescription;
    this.formData = {
      clienteRut: prescription.clienteRut,
      clienteNombre: prescription.clienteNombre,
      clienteTelefono: prescription.clienteTelefono || '',
      tipo: prescription.tipo,
      ojoDerecho: prescription.ojoDerecho ? { ...prescription.ojoDerecho } : this.getEmptyFormData().ojoDerecho,
      ojoIzquierdo: prescription.ojoIzquierdo ? { ...prescription.ojoIzquierdo } : this.getEmptyFormData().ojoIzquierdo,
      distanciaPupilar: prescription.distanciaPupilar || '',
      observaciones: prescription.observaciones || ''
    };
    this.showModal = true;
  }

  openDetailModal(prescription: Prescription): void {
    this.detailPrescription = prescription;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.detailPrescription = null;
    this.showDetailModal = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPrescription = null;
    this.errorMessage = '';
  }

  savePrescription(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.clienteRut || !this.formData.clienteNombre) {
      this.errorMessage = 'El RUT y nombre del cliente son requeridos';
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.selectedPrescription) {
      const updateData: UpdatePrescriptionDto = { ...this.formData };
      this.prescriptionsService.update(this.selectedPrescription._id, updateData).subscribe({
        next: () => {
          this.successMessage = 'Receta actualizada exitosamente';
          this.closeModal();
          this.loadPrescriptions();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar receta';
        }
      });
    } else {
      this.prescriptionsService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Receta creada exitosamente';
          this.closeModal();
          this.loadPrescriptions();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear receta';
        }
      });
    }
  }

  confirmDelete(prescription: Prescription): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Solo los administradores pueden eliminar recetas';
      return;
    }
    this.prescriptionToDelete = prescription;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.prescriptionToDelete = null;
    this.showDeleteConfirm = false;
  }

  deletePrescription(): void {
    if (!this.prescriptionToDelete || !this.isAdmin) return;

    this.isLoading = true;
    this.prescriptionsService.delete(this.prescriptionToDelete._id).subscribe({
      next: () => {
        this.successMessage = 'Receta eliminada exitosamente';
        this.cancelDelete();
        this.loadPrescriptions();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al eliminar receta';
        this.cancelDelete();
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatEyeData(eye: EyeData | undefined): string {
    if (!eye) return '-';
    const parts = [];
    if (eye.esfera) parts.push(`Esf: ${eye.esfera}`);
    if (eye.cilindro) parts.push(`Cil: ${eye.cilindro}`);
    if (eye.eje) parts.push(`Eje: ${eye.eje}`);
    return parts.length > 0 ? parts.join(', ') : '-';
  }
}
