import { Paciente } from "../../paciente/models/paciente";

export class Historia {
    id!: number;
    paciente!: Paciente;
    descripcion!: string;
    fecha!:Date;
}