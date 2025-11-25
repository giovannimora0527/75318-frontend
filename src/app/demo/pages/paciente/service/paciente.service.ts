import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:8000/clinica/v1/paciente';

  constructor(private http: HttpClient) {}

  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/listar`);
  }

guardarPaciente(paciente: Paciente): Observable<Paciente> {
  return this.http.post<Paciente>(`${this.apiUrl}/guardar`, paciente);
}

actualizarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
  return this.http.put<Paciente>(`${this.apiUrl}/actualizar/${id}`, paciente);
}


  buscarPorDocumento(numeroDocumento: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/buscar`, {
      params: { numeroDocumento }
    });
  }
}
