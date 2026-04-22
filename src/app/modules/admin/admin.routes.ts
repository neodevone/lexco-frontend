import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users').then(m => m.Users)
  },
  {
    path: 'products',
    loadComponent: () => import('./products/products').then(m => m.Products)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];