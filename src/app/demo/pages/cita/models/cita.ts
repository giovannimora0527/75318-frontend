import { Medico } from "../../medico/models/medico";
import { Paciente } from "../../paciente/models/paciente";

export class Cita {
        id!: number;
        pacienteId!: Paciente;
        medicoId!: Medico;
        fechaHora!: Date;
        estado!: string;
        motivo!: string;
}
