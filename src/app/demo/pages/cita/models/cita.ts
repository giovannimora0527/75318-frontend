import { Medico } from "../../medico/models/medico";
import { Paciente } from "../../paciente/models/paciente";

// src/app/demo/pages/cita/model/cita.model.ts
export interface Cita {
  id?: number; // Opcional al crear
  paciente: Paciente;
  medico: Medico;
  fechaHora: string; // Formato "yyyy-MM-dd HH:mm:ss"
  estado: string;
  motivo: string;
}


