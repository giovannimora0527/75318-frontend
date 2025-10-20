export class Paciente {
    // El ID es opcional al crear, pero el backend lo devuelve.
    id?: number; 
    usuarioId!: number;
    tipoDocumento!: string;
    numeroDocumento!: string; // Corresponde a 'documento' en algunos ejemplos
    nombres!: string;
    apellidos!: string;
    fechaNacimiento!: string; // Usamos string para el formato ISO (YYYY-MM-DD)
    genero!: string;
    telefono!: string;
    direccion!: string;
}
