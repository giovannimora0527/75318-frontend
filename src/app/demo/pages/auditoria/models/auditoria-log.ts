export interface AuditoriaLog {
  id: number;
  fechaHora: string;
  usuarioUsername?: string;  
  tipoEvento: string;
  descripcion: string;
  ipAddress?: string;        
  resultado?: string;
  detallesAdicionales?: string;
}