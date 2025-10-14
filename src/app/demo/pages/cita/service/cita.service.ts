import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'cita';

  constructor(private readonly backendService: BackendService) {}

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarCita(cita: Cita): Observable<any> {
    return this.backendService.post(this.urlBase, this.endpoint, 'crear', cita);
  }

  actualizarCita(cita: Cita): Observable<any> {
    return this.backendService.put(this.urlBase, this.endpoint, 'actualizar', cita);
  }
}

