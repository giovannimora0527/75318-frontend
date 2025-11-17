import { Medico } from '../../medico/models/medico';
import { Paciente } from '../../paciente/models/paciente';

export class Cita {
    id!: number;
    fecha!: string;
    hora!: string;
    motivo!: string;
    estado!: string;
    medico!: Medico;
    paciente!: Paciente;
    observaciones!: string;
}
