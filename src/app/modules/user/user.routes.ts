import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'catalog',
    loadComponent: () => import('./catalog/catalog').then(m => m.Catalog)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetail)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart').then(m => m.Cart)
  },
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  }
];