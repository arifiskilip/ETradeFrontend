import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/layout/layout.component').then((c) => c.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/components/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./admin/components/customer/customer.component').then(
            (c) => c.CustomerComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/components/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/components/products/products.component').then(
            (c) => c.ProductsComponent
          ),
      },
    ], canActivate:[authGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./ui/components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./ui/components/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./ui/components/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./ui/components/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./ui/components/products/products.component').then(
        (c) => c.ProductsComponent
      ),
  },
  {
    path: 'products/:page',
    loadComponent: () =>
      import('./ui/components/products/products.component').then(
        (c) => c.ProductsComponent
      ),
  },
  {
    path: 'basket',
    loadComponent: () =>
      import('./ui/components/basket/basket.component').then(
        (c) => c.BasketComponent
      ),
      canActivate:[authGuard]
  }
];
