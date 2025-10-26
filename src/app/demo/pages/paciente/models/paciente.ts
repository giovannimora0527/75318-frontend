import { Usuario } from "src/app/models/usuario";

export class Paciente {
    id!: number;
    nombres!: string;
    apellidos!: string;
    numeroDocumento!: string;
    tipoDocumento!: string;
    telefono!: string;
    direccion!: string;
    genero!: string;
    fechaNacimiento!: Date;
    usuario!: Usuario;
}