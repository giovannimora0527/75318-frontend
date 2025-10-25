export class Medicamento {
    id!: number;
    nombre!: string;
    descripcion!: string;
    presentacion!: string;
    fechaModificacionRegistro!: string;
}

export class MedicamentoRq {
    id?: number;
    nombre!: string;
    descripcion!: string;
    presentacion!: string;
}

export class RespuestaRs {
    codigo!: string;
    mensaje!: string;
    data!: any;
}