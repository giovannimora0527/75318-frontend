import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';
import { RespuestaRs } from '../models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase = environment.apiUrl;
  endpoint: string = 'especializacion';

  constructor(private readonly backendService: BackendService) {}

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarEspecializacion(especializacion: Especializacion): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', especializacion);
  }

  actualizarEspecializacion(especializacion: Especializacion): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', especializacion);
  }

  buscarPorCodigo(codigo: string): Observable<Especializacion> {
    const urlConCodigo = `buscar-por-codigo?codigo=${codigo}`;
    return this.backendService.get(this.urlBase, this.endpoint, urlConCodigo);
  }
}
