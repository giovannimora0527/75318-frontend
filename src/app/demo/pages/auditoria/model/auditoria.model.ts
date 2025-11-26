export interface Auditoria {
  id: number;
  usuario: string;
  accion: string;
  descripcion: string;
  ip: string;
  fechaHora: string; // viene como string desde el backend
}
