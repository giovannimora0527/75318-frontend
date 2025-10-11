export interface HistoriaMedica {
  id?: number;
  idPaciente: number;
  idMedico: number;
  fecha: string;   
  motivoConsulta: string;
  antecedentes?: string;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
}
