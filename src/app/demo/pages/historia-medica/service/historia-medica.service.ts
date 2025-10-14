import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { HistoriaMedica } from '../models/historia-medica';

@Injectable({
  providedIn: 'root'
})
export class HistoriaMedicaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'historia-medica';

  constructor(private readonly backendService: BackendService) {}

  listarHistorias(): Observable<HistoriaMedica[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarHistoria(historia: HistoriaMedica): Observable<any> {
    return this.backendService.post(this.urlBase, this.endpoint, 'crear', historia);
  }

  actualizarHistoria(historia: HistoriaMedica): Observable<any> {
    return this.backendService.put(this.urlBase, this.endpoint, 'actualizar', historia);
  }
}

