export interface Medicamento {
  id?: number;
  nombre: string;
  descripcion: string;
  presentacion: string;
  fechaCompra: string;   // en Angular las fechas se manejan como string
  fechaVence: string;
}
