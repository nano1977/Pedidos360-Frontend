import { Routes } from '@angular/router';
import { PedidosComponent } from './pedidos/pedidos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
  { path: 'pedidos', component: PedidosComponent }
];