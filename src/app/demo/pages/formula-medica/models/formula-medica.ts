import { Medico } from '../../medico/models/medico';
import { Paciente } from '../../cita/models/paciente';
import { Medicamento } from '../../medicamento/models/medicamento';

export class FormulaMedica {
    id!: number;
    fecha!: string;
    diagnostico!: string;
    indicaciones!: string;
    medico!: Medico;
    paciente!: Paciente;
    medicamentos!: Medicamento[];
    observaciones!: string;
}

