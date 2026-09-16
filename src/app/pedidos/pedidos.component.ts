import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../models/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  nuevoPedido: Pedido = { cliente: '', descripcion: '', total: 0 };

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidoService.obtenerPedidos().subscribe({
      next: (data: Pedido[]) => (this.pedidos = data),
      error: (err: unknown) => console.error('Error al cargar pedidos:', err)
    });
  }

  guardarPedido(): void {
    if (!this.nuevoPedido.cliente || !this.nuevoPedido.descripcion) return;

    this.pedidoService.crearPedido(this.nuevoPedido).subscribe({
      next: (res: Pedido) => {
        this.pedidos.push(res);
        this.nuevoPedido = { cliente: '', descripcion: '', total: 0 };
      },
      error: (err: unknown) => console.error('Error al crear pedido:', err)
    });
  }
}