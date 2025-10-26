import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { FormulaMedica } from '../models/formula-medica';
import { RespuestaRs } from 'src/app/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  private readonly urlBase = environment.apiUrl;
  private readonly endpoint = 'receta';
  
  constructor(private readonly backendService: BackendService) {}

  listarFormulas(): Observable<FormulaMedica[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarFormula(formula: FormulaMedica): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', formula);
  }

  actualizarFormula(formula: FormulaMedica): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', formula);
  }
}
