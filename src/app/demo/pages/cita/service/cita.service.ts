import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8000/clinica/v1/citas';

  constructor(private http: HttpClient) {}

  // Crear una nueva cita
  crearCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/crear`, cita);
  }

  // Listar todas las citas
  listarCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/listar`);
  }

  // Listar citas por fechaHora descendente
  listarCitasPorFechaHoraDesc(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/listar-desc`);
  }

  // Buscar citas por id de paciente
  buscarCitasPorPacienteId(pacienteId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }
}
