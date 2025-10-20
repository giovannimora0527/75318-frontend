import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';
import { RespuestaRs } from 'src/app/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  private readonly urlBase = environment.apiUrl;
  private readonly endpoint = 'especializacion';

  constructor(private readonly backendService: BackendService) {}

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarEspecializacion(e: Especializacion): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', e);
  }

  actualizarEspecializacion(e: Especializacion): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', e);
  }
}
