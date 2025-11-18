import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Auditoria } from '../models/auditoria';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'auditoria';

  constructor(private readonly backendService: BackendService) {}

  listarAuditorias(tipoEvento?: string): Observable<Auditoria[]> {
    let params = new HttpParams();
    if (tipoEvento) {
      params = params.set('tipoEvento', tipoEvento);
    }
    return this.backendService.get(this.urlBase, this.endpoint, 'listar', params);
  }
}

