export interface Medicamento {
  id?: number;
  nombre: string;
  descripcion: string;
  presentacion?: string;
  fecha_compra?: string;
  fecha_vence?: string;
  fecha_creacion_registro?: string;
  fecha_modificacion_registro?: string;
}
