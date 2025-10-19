import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente, PacienteRq } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  urlBase = environment.apiUrl;
  endpoint: string = 'paciente';

  constructor(private readonly backendService: BackendService) {}

  /**
   * Lista todos los pacientes
   * GET /paciente/listar
   */
  listarPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  /**
   * Busca un paciente por número de documento
   * GET /paciente/por_documento?numeroDocumento=123456
   */
  encontrarPorDocumento(numeroDocumento: string): Observable<Paciente> {
    const params = new HttpParams().set('numeroDocumento', numeroDocumento);
    return this.backendService.get(this.urlBase, this.endpoint, 'por_documento', params);
  }

  /**
   * Lista pacientes por fecha de nacimiento
   * GET /paciente/por-fecha-nacimiento?orden=asc
   */
  listarPacientesPorFechaNacimiento(orden: string = 'asc'): Observable<Paciente[]> {
    const params = new HttpParams().set('orden', orden);
    return this.backendService.get(this.urlBase, this.endpoint, 'por-fecha-nacimiento', params);
  }

  /**
   * Guarda un nuevo paciente
   * POST /paciente/guardar
   */
  guardarPaciente(paciente: PacienteRq): Observable<Paciente> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', paciente);
  }

  /**
   * Actualiza un paciente existente
   * PUT /paciente/actualizar/{id}
   */
  actualizarPaciente(id: number, paciente: PacienteRq): Observable<Paciente> {
    return this.backendService.put(this.urlBase, this.endpoint, `actualizar/${id}`, paciente);
  }
}