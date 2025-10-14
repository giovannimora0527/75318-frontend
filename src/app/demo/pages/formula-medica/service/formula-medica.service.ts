import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { FormulaMedica } from '../models/formula-medica';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'formula-medica';

  constructor(private readonly backendService: BackendService) {}

  listarFormulas(): Observable<FormulaMedica[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarFormula(formula: FormulaMedica): Observable<any> {
    return this.backendService.post(this.urlBase, this.endpoint, 'crear', formula);
  }

  actualizarFormula(formula: FormulaMedica): Observable<any> {
    return this.backendService.put(this.urlBase, this.endpoint, 'actualizar', formula);
  }
}

