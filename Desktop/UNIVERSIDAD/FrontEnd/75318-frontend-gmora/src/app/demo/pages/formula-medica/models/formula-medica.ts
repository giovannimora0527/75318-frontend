export interface FormulaMedica {
  id?: number;
  citaId: number;
  medicamentoId: number;
  dosis: string;    
  indicaciones: string;
  fechaCreacionRegistro?: string;            
}
