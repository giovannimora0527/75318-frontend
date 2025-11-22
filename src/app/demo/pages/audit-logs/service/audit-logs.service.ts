import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogsService {

  urlBase = environment.apiUrl;
  endpoint: string = 'audit';

  constructor(private readonly backendService: BackendService) {}

  listarAuditoria(filtros: any): Observable<any> {

    const params: any = {};

    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '') {
        params[key] = value;
      }
    });

    return this.backendService.getConParams(
      this.urlBase,
      this.endpoint,
      'listar',
      params
    );
  }
}
