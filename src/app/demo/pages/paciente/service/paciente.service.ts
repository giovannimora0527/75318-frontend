import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  urlBase = environment.apiUrl;
  endpoint: string = 'paciente';

  constructor(private readonly backendService: BackendService) {}

  listarPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarPaciente(paciente: Paciente): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', paciente);
  }

  actualizarPaciente(paciente: Paciente): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', paciente);
  }
}
