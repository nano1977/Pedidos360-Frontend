import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; border: 1px dashed #0078d4; margin-top: 20px; border-radius: 5px; background-color: #f0f8ff;">
      <h2>📦 Módulo de Pedidos (Protegido)</h2>
      <p>Acceso concedido correctamente a través de <strong>MsalGuard</strong>.</p>
    </div>
  `
})
export class PedidosComponent {}