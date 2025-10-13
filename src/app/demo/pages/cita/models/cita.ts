export interface Cita {
  id?: number;
  fecha: string;           
  hora: string;              
  motivo: string;
  observaciones?: string;
  idPaciente: number;
  idMedico: number;
  estado?: string;
}
