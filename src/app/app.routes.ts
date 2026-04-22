import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () => import('./modules/user/user.routes').then(m => m.USER_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];