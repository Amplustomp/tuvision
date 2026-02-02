import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientsService } from '../../core/services/clients.service';
import { AuthService } from '../../core/services/auth.service';
import { Client, CreateClientDto, UpdateClientDto } from '../../core/models';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isAdmin = false;

  searchRut = '';
  searchNombre = '';
  searchEmail = '';

  showModal = false;
  isEditing = false;
  selectedClient: Client | null = null;

  formData: CreateClientDto = this.getEmptyFormData();

  showDeleteConfirm = false;
  clientToDelete: Client | null = null;

  showDetailModal = false;
  detailClient: Client | null = null;

  private subscription = new Subscription();
  private clientsService = inject(ClientsService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.isAdmin = user?.role === 'admin';
      })
    );
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getEmptyFormData(): CreateClientDto {
    return {
      rut: '',
      nombre: '',
      telefono: '',
      email: ''
    };
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.clientsService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar clientes';
        this.isLoading = false;
        console.error('Error loading clients:', error);
      }
    });
  }

  applyFilters(): void {
    if (!this.searchRut && !this.searchNombre && !this.searchEmail) {
      this.filteredClients = [...this.clients].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return;
    }

    this.isLoading = true;
    this.clientsService.search({
      rut: this.searchRut || undefined,
      nombre: this.searchNombre || undefined,
      email: this.searchEmail || undefined
    }).subscribe({
      next: (clients) => {
        this.filteredClients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al buscar clientes';
        this.isLoading = false;
        console.error('Error searching clients:', error);
      }
    });
  }

  clearFilters(): void {
    this.searchRut = '';
    this.searchNombre = '';
    this.searchEmail = '';
    this.applyFilters();
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedClient = null;
    this.formData = this.getEmptyFormData();
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Solo los administradores pueden editar clientes';
      return;
    }
    this.isEditing = true;
    this.selectedClient = client;
    this.formData = {
      rut: client.rut,
      nombre: client.nombre,
      telefono: client.telefono || '',
      email: client.email || ''
    };
    this.showModal = true;
  }

  openDetailModal(client: Client): void {
    this.detailClient = client;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.detailClient = null;
    this.showDetailModal = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedClient = null;
    this.errorMessage = '';
  }

  saveClient(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.rut || !this.formData.nombre) {
      this.errorMessage = 'El RUT y nombre del cliente son requeridos';
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.selectedClient) {
      const updateData: UpdateClientDto = { ...this.formData };
      this.clientsService.update(this.selectedClient._id, updateData).subscribe({
        next: () => {
          this.successMessage = 'Cliente actualizado exitosamente';
          this.closeModal();
          this.loadClients();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar cliente';
        }
      });
    } else {
      this.clientsService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Cliente creado exitosamente';
          this.closeModal();
          this.loadClients();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear cliente';
        }
      });
    }
  }

  confirmDelete(client: Client): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Solo los administradores pueden eliminar clientes';
      return;
    }
    this.clientToDelete = client;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.clientToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteClient(): void {
    if (!this.clientToDelete || !this.isAdmin) return;

    this.isLoading = true;
    this.clientsService.delete(this.clientToDelete._id).subscribe({
      next: () => {
        this.successMessage = 'Cliente eliminado exitosamente';
        this.cancelDelete();
        this.loadClients();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al eliminar cliente';
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
}
