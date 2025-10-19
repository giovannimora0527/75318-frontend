export class Paciente {
    id!: number;
    nombres!: string;
    apellidos!: string;
    numeroDocumento!: string;
    tipoDocumento!: string;
    telefono!: string;
    email!: string;
    fechaNacimiento!: string;
    direccion!: string;
    genero!: string;
    activo!: boolean;
    usuarioId!: number;
    fechaRegistro!: string;
}

export class PacienteRq {
    nombres!: string;
    apellidos!: string;
    numeroDocumento!: string;
    tipoDocumento!: string;
    telefono!: string;
    email!: string;
    fechaNacimiento!: string;
    direccion!: string;
    genero!: string;
    usuarioId!: number; // Requerido
}