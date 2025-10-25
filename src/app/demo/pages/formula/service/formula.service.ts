import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';
import { Formula } from '../models/formula';
import { Medicamento } from '../models/medicamento';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})

export class FormulaService {
  
  urlBase = environment.apiUrl;
  endpoint: string = 'formula';

  constructor(private readonly backendService: BackendService) {}

  listarFormulas(): Observable<Formula[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listarMedicamentos');
  }

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listarCitas');
  }

  guardarFormula(formula: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', formula);
  }

  actualizarFormula(formula: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', formula);
  }

}
