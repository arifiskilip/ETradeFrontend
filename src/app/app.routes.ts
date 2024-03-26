import { Routes } from '@angular/router';

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
    ],
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
    path: 'basket',
    loadComponent: () =>
      import('./ui/components/basket/basket.component').then(
        (c) => c.BasketComponent
      ),
  }
];
