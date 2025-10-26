import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Formula } from '../models/formula';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'receta';

  constructor(private readonly backendService: BackendService) {}

  listarRecetas(): Observable<Formula[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarReceta(receta: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', receta);
  }

  actualizarReceta(receta: Formula): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', receta);
  }
}
