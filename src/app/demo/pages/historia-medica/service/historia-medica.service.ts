import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { HistoriaMedica } from '../models/historia-medica';
import { RespuestaRs } from 'src/app/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class HistoriaMedicaService {
  private readonly urlBase = environment.apiUrl;
  private readonly endpoint = 'historia-medica';

  constructor(private readonly backendService: BackendService) {}

  listarHistorias(): Observable<HistoriaMedica[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarHistoria(h: HistoriaMedica): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', h);
  }

  actualizarHistoria(h: HistoriaMedica): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', h);
  }
}
