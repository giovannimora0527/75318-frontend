import { Paciente } from "../../paciente/models/paciente";

export interface Historia {
  id?: number;
  paciente: Paciente;      // objeto completo
  descripcion: string;
  fecha: string;           // LocalDate en formato YYYY-MM-DD
}
