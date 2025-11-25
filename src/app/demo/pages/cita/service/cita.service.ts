import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitaRespDTO } from '../models/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8000/clinica/v1/citas';

  constructor(private http: HttpClient) {}

  // Crear una nueva cita
  crearCita(cita: CitaRespDTO): Observable<CitaRespDTO> {
    return this.http.post<CitaRespDTO>(`${this.apiUrl}/crear`, cita);
  }

  // Listar todas las citas
  listarCitas(): Observable<CitaRespDTO[]> {
    return this.http.get<CitaRespDTO[]>(`${this.apiUrl}/listar`);
  }

  // Listar citas por fechaHora descendente
  listarCitasPorFechaHoraDesc(): Observable<CitaRespDTO[]> {
    return this.http.get<CitaRespDTO[]>(`${this.apiUrl}/listar-desc`);
  }

  // Buscar citas por id de paciente
  buscarCitasPorPacienteId(pacienteId: number): Observable<CitaRespDTO[]> {
    return this.http.get<CitaRespDTO[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }
}
