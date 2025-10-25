export interface Cita {
  id: number;
  // agregar campos reales si los tienes (fecha, paciente, etc.)
}

export interface Medicamento {
  id: number;
  nombre?: string;
  // otros campos si aplican
}

export interface Receta {
  id: number;
  cita?: Cita | null;
  medicamento?: Medicamento | null;
  dosis?: string | null;
  indicaciones?: string | null;
  fechaCreacionRegistro?: string | null; // ISO datetime en string
}
