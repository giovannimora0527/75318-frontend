import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { AuditoriaLog } from '../models/auditoria-log';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private urlBase = environment.apiUrl;
  private endpoint = 'api/auditoria';

  constructor(private backendService: BackendService) {}

  listarLogs(
    fechaDesde?: string,
    fechaHasta?: string,
    usuario?: string,
    evento?: string
  ): Observable<AuditoriaLog[]> {
    // Usa directamente un objeto compatible con Record<string, string>
    const params: Record<string, string> = {};
    if (fechaDesde) params['fechaDesde'] = fechaDesde;   // ← Usa ['fechaDesde']
    if (fechaHasta) params['fechaHasta'] = fechaHasta;   // ← Usa ['fechaHasta']
    if (usuario) params['usuario'] = usuario;             // ← Usa ['usuario']
    if (evento) params['evento'] = evento;                // ← Usa ['evento']

    return this.backendService.getWithParams(this.urlBase, this.endpoint, 'logs', params);
  }
}