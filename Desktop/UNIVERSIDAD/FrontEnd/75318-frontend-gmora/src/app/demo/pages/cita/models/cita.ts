export interface Cita {
  id?: number;
  pacienteId: number;
  medicoId: number;
  fechaHora: string;
  estado: string;
  motivo: string;
  nombrePaciente: string;
  nombreMedico: string;
}