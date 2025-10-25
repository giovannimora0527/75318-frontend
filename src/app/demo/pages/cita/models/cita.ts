import { Medico } from 'src/app/demo/pages/medico/models/medico';
import { Paciente } from 'src/app/demo/pages/paciente/models/paciente';

export class Cita {
    id!: number;
    paciente!: Paciente;
    medico!: Medico;
    motivo!: string;
    estado!: string;
    fechaHora!: Date;
}
