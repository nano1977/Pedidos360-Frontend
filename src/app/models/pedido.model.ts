export interface Pedido {
  id?: number;
  cliente: string;
  descripcion: string;
  total: number;
  estado?: string;
  fechaCreacion?: string;
}