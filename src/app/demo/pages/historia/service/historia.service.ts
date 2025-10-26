import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';
import { Historia } from '../models/historia';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'historia';

  constructor(private readonly backendService: BackendService) {}

  listarHistorias(): Observable<Historia[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarHistoria(historia: Historia): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', historia);
  }

  actualizarHistoria(historia: Historia): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', historia);
  }
}
