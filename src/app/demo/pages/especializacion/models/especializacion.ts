export class Especializacion {
    id!: number;
    codigoEspecializacion!: string;
    nombre!: string;
    descripcion!: string;
}

export class EspecializacionRq {
    codigoEspecializacion!: string;
    nombre!: string;
    descripcion!: string;
}

// Para el backend que espera Especializacion completa
export class EspecializacionCreate {
    codigoEspecializacion!: string;
    nombre!: string;
    descripcion!: string;
}