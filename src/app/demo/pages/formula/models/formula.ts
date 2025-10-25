import {Cita} from './cita';
import {Medicamento} from './medicamento';

export class Formula {
  id!: number;
  cita_id!: string;
  medicamento_id!: string;
  dosis!: string;
  indicaciones!: string;
}
  // servicio para manejar las formulas medicas

