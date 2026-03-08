import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { OrdersComponent } from './pages/orders/orders.component';

export const routes: Routes = [
    { path: '', component: CatalogComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'orders', component: OrdersComponent },
    { path: '**', redirectTo: '' }
];
