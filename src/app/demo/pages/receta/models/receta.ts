import { Medico } from '../../medico/models/medico';
import { Paciente } from '../../cita/models/paciente';
import { Medicamento } from '../../medicamento/models/medicamento';

export class Receta {
    id!: number;
    fecha!: string;
    diagnostico!: string;
    indicaciones!: string;
    medico!: Medico;
    paciente!: Paciente;
    medicamentos!: Medicamento[];
    observaciones!: string;
    activo!: boolean;
    fechaCreacion!: string;
    citaId!: number;
    dosis!: string;
}

export class RecetaRq {
    fecha!: string;
    diagnostico!: string;
    indicaciones!: string;
    medicoId!: number;
    pacienteId!: number;
    medicamentoIds!: number[];
    observaciones!: string;
    citaId!: number;
    dosis!: string;
}

export class MedicamentoFormula {
    id!: number;
    nombre!: string;
    dosis!: string;
    frecuencia!: string;
    duracion!: string;
    observaciones!: string;
}


