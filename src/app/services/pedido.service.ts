import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  // Apuntando directamente al API Gateway en AWS
  private apiUrl = 'https://lwsszyczih.execute-api.us-east-1.amazonaws.com/api/pedidos';

  constructor(private http: HttpClient) {}

  obtenerPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  crearPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }
}