import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import {ProductsComponent} from './pages/products/products';
import { CartComponent } from './pages/cart/cart';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'cart',component: CartComponent}
];
