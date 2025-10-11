export interface FormulaMedica {
  id?: number;
  idPaciente: number;
  idMedico: number;
  fecha: string;       
  diagnostico: string;
  indicaciones: string;
  medicamento: string;          
  dosis: string;
  duracion: string;            
}
