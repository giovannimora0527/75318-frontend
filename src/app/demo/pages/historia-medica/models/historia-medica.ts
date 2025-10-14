import { Paciente } from '../../cita/models/paciente';

export class HistoriaMedica {
    id!: number;
    fechaCreacion!: string;
    paciente!: Paciente;
    antecedentesFamiliares!: string;
    antecedentesPersonales!: string;
    alergias!: string;
    enfermedadesCronicas!: string;
    cirugiasPrevias!: string;
    medicamentosActuales!: string;
    observaciones!: string;
}

