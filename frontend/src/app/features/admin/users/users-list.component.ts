import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, CreateUserDto, UpdateUserDto } from '../../../core/services/users.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  showModal = false;
  isEditing = false;
  selectedUser: User | null = null;

  formData: CreateUserDto = {
    email: '',
    password: '',
    nombre: '',
    rut: '',
    role: 'vendedor'
  };

  showDeleteConfirm = false;
  userToDelete: User | null = null;

  private usersService = inject(UsersService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.usersService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar usuarios';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedUser = null;
    this.formData = {
      email: '',
      password: '',
      nombre: '',
      rut: '',
      role: 'vendedor'
    };
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditing = true;
    this.selectedUser = user;
    this.formData = {
      email: user.email,
      password: '',
      nombre: user.nombre,
      rut: user.rut || '',
      role: user.role
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.errorMessage = '';
  }

  saveUser(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.email || !this.formData.nombre || !this.formData.rut) {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    if (!this.isEditing && !this.formData.password) {
      this.errorMessage = 'La contraseña es requerida para nuevos usuarios';
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.selectedUser) {
      const updateData: UpdateUserDto = {
        email: this.formData.email,
        nombre: this.formData.nombre,
        rut: this.formData.rut,
        role: this.formData.role
      };
      if (this.formData.password) {
        updateData.password = this.formData.password;
      }

      this.usersService.update(this.selectedUser.id, updateData).subscribe({
        next: () => {
          this.successMessage = 'Usuario actualizado exitosamente';
          this.closeModal();
          this.loadUsers();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al actualizar usuario';
        }
      });
    } else {
      this.usersService.create(this.formData).subscribe({
        next: () => {
          this.successMessage = 'Usuario creado exitosamente';
          this.closeModal();
          this.loadUsers();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear usuario';
        }
      });
    }
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.userToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.isLoading = true;
    this.usersService.delete(this.userToDelete.id).subscribe({
      next: () => {
        this.successMessage = 'Usuario eliminado exitosamente';
        this.cancelDelete();
        this.loadUsers();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al eliminar usuario';
        this.cancelDelete();
      }
    });
  }

  toggleUserStatus(user: User): void {
    const newStatus = !user.isActive;
    this.usersService.update(user.id, { isActive: newStatus }).subscribe({
      next: () => {
        this.successMessage = `Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`;
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al cambiar estado del usuario';
      }
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
