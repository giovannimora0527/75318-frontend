import { Medico } from "../../medico/models/medico";
import { Paciente } from "../../paciente/models/paciente";

export class Cita {
  id!: number;
  pacienteId!: number;
  medicoId!: number;
  motivo!: string;
  fechaHora!: string;
  estado!: string;
}
