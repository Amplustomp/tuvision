import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'work-orders',
        loadComponent: () => import('./features/work-orders/work-orders-list.component').then(m => m.WorkOrdersListComponent)
      },
      {
        path: 'prescriptions',
        loadComponent: () => import('./features/prescriptions/prescriptions-list.component').then(m => m.PrescriptionsListComponent)
      },
      {
        path: 'admin/users',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/users/users-list.component').then(m => m.UsersListComponent)
      },
      {
        path: 'admin/prescriptions',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/prescriptions/prescriptions-list.component').then(m => m.PrescriptionsListComponent)
      },
      {
        path: 'admin/work-orders',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/work-orders/work-orders-list.component').then(m => m.WorkOrdersListComponent)
      },
      {
        path: '',
        redirectTo: 'work-orders',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
