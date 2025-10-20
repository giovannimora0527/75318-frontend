import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service'; 
import { environment } from 'src/environments/environment';
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

  listarPacientesXOrden(orden: 'asc' | 'desc'): Observable<Paciente[]> {
    const urlConOrden = `listar-orden-fecha-nacimiento?orden=${orden}`;
    return this.backendService.get(this.urlBase, this.endpoint, urlConOrden);
  }

  guardarOActualizar(paciente: Paciente): Observable<Paciente> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar-o-actualizar', paciente);
  }

  buscarPorDocumento(numeroDocumento: string): Observable<Paciente> {
    const urlConDocumento = `buscar-paciente-documento?numeroDocumento=${numeroDocumento}`;
    return this.backendService.get(this.urlBase, this.endpoint, urlConDocumento);
  }
}
