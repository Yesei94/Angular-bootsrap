import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  phone?: string;
  department?: string;
  notes?: string;
  avatar: string;
  lastLogin: Date;
  selected?: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  selectAll: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  
  // Modal states
  isEditMode: boolean = false;
  selectedUser: User | null = null;
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['', Validators.required],
      phone: [''],
      department: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.filterUsers();
  }

  loadUsers(): void {
    // Mock data - En una aplicación real, esto vendría de un servicio
    this.users = [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        role: 'admin',
        status: 'active',
        phone: '+1 234 567 8900',
        department: 'IT',
        notes: 'Administrador principal del sistema',
        avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=007bff&color=ffffff&size=40',
        lastLogin: new Date('2024-01-15T10:30:00')
      },
      {
        id: 2,
        name: 'María García',
        email: 'maria.garcia@example.com',
        role: 'user',
        status: 'active',
        phone: '+1 234 567 8901',
        department: 'Marketing',
        notes: 'Especialista en marketing digital',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=28a745&color=ffffff&size=40',
        lastLogin: new Date('2024-01-14T15:45:00')
      },
      {
        id: 3,
        name: 'Carlos López',
        email: 'carlos.lopez@example.com',
        role: 'moderator',
        status: 'active',
        phone: '+1 234 567 8902',
        department: 'Soporte',
        notes: 'Moderador de contenido',
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=ffc107&color=000000&size=40',
        lastLogin: new Date('2024-01-13T09:20:00')
      },
      {
        id: 4,
        name: 'Ana Martínez',
        email: 'ana.martinez@example.com',
        role: 'user',
        status: 'inactive',
        phone: '+1 234 567 8903',
        department: 'Ventas',
        notes: 'Representante de ventas',
        avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=dc3545&color=ffffff&size=40',
        lastLogin: new Date('2024-01-10T14:15:00')
      },
      {
        id: 5,
        name: 'Luis Rodríguez',
        email: 'luis.rodriguez@example.com',
        role: 'user',
        status: 'pending',
        phone: '+1 234 567 8904',
        department: 'Recursos Humanos',
        notes: 'Nuevo empleado en proceso de activación',
        avatar: 'https://ui-avatars.com/api/?name=Luis+Rodriguez&background=6c757d&color=ffffff&size=40',
        lastLogin: new Date('2024-01-12T11:30:00')
      },
      {
        id: 6,
        name: 'Sofia Herrera',
        email: 'sofia.herrera@example.com',
        role: 'admin',
        status: 'active',
        phone: '+1 234 567 8905',
        department: 'Finanzas',
        notes: 'Administradora financiera',
        avatar: 'https://ui-avatars.com/api/?name=Sofia+Herrera&background=17a2b8&color=ffffff&size=40',
        lastLogin: new Date('2024-01-15T08:45:00')
      },
      {
        id: 7,
        name: 'Diego Morales',
        email: 'diego.morales@example.com',
        role: 'user',
        status: 'active',
        phone: '+1 234 567 8906',
        department: 'Desarrollo',
        notes: 'Desarrollador frontend',
        avatar: 'https://ui-avatars.com/api/?name=Diego+Morales&background=6f42c1&color=ffffff&size=40',
        lastLogin: new Date('2024-01-14T16:20:00')
      },
      {
        id: 8,
        name: 'Elena Vargas',
        email: 'elena.vargas@example.com',
        role: 'moderator',
        status: 'inactive',
        phone: '+1 234 567 8907',
        department: 'Calidad',
        notes: 'Moderadora de calidad',
        avatar: 'https://ui-avatars.com/api/?name=Elena+Vargas&background=fd7e14&color=ffffff&size=40',
        lastLogin: new Date('2024-01-08T13:10:00')
      }
    ];
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getRoleBadgeClass(role: string): string {
    const classes = {
      'admin': 'bg-danger',
      'user': 'bg-primary',
      'moderator': 'bg-warning text-dark'
    };
    return classes[role as keyof typeof classes] || 'bg-secondary';
  }

  getRoleLabel(role: string): string {
    const labels = {
      'admin': 'Administrador',
      'user': 'Usuario',
      'moderator': 'Moderador'
    };
    return labels[role as keyof typeof labels] || role;
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'active': 'bg-success',
      'inactive': 'bg-secondary',
      'pending': 'bg-warning text-dark'
    };
    return classes[status as keyof typeof classes] || 'bg-secondary';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'pending': 'Pendiente'
    };
    return labels[status as keyof typeof labels] || status;
  }

  toggleSelectAll(): void {
    this.filteredUsers.forEach(user => user.selected = this.selectAll);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  // Modal methods
  openAddUserModal(): void {
    this.isEditMode = false;
    this.selectedUser = null;
    this.userForm.reset();
    this.showModal('userModal');
  }

  editUser(user: User): void {
    this.isEditMode = true;
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.showModal('userModal');
  }

  viewUser(user: User): void {
    // Implementar vista de usuario
    console.log('Ver usuario:', user);
  }

  deleteUser(user: User): void {
    this.selectedUser = user;
    this.showModal('deleteModal');
  }

  confirmDelete(): void {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index > -1) {
        this.users.splice(index, 1);
        this.filterUsers();
      }
      this.hideModal('deleteModal');
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      
      if (this.isEditMode && this.selectedUser) {
        // Editar usuario existente
        const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (index > -1) {
          this.users[index] = {
            ...this.users[index],
            ...userData,
            avatar: this.users[index].avatar // Mantener avatar existente
          };
        }
      } else {
        // Crear nuevo usuario
        const newUser: User = {
          id: Math.max(...this.users.map(u => u.id)) + 1,
          ...userData,
          avatar: `https://via.placeholder.com/40/007bff/ffffff?text=${userData.name.charAt(0).toUpperCase()}`,
          lastLogin: new Date()
        };
        this.users.push(newUser);
      }
      
      this.filterUsers();
      this.hideModal('userModal');
    }
  }

  exportUsers(): void {
    // Implementar exportación de usuarios
    console.log('Exportar usuarios');
  }

  refreshUsers(): void {
    this.loadUsers();
    this.filterUsers();
  }

  // Utility methods for modals
  private showModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Usar Bootstrap 5 modal API
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  private hideModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  }

  // Math utility for template
  Math = Math;
}