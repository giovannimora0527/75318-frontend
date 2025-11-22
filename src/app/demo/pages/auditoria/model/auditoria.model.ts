export interface Auditoria {
  id: number;
  fechaHora: string; 
  nombreUsuario: string;
  tablaAfectada: string;
  idRegistroAfectado: number;
  tipoEvento: string;
  valoresAntes: string;
  valoresDespues: string;
  descripcion: string;
  ipOrigen: string;
}
    