import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management').then(m => m.UserManagementComponent)
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  }
];
