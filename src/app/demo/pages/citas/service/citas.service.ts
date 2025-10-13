import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CitaRq {
  id?: number; // Propiedad ID agregada para manejar actualizaciones
  pacienteId: number;
  medicoId: number;
  fechaHora: string;
  estado: string;
  motivo?: string;
}

export interface CitaRs {
  id: number;
  fechaHora: string;
  estado: string;
  motivo: string;
  pacienteId: number;
  nombreCompletoPaciente: string;
  medicoId: number;
  nombreCompletoMedico: string;
}

export interface RespuestaRs {
  mensaje: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private readonly apiUrl = 'http://localhost:8000/clinica/v1/cita'; // URL base corregida

  constructor(private readonly http: HttpClient) {}

  listarCitas(): Observable<CitaRs[]> {
    return this.http.get<CitaRs[]>(`${this.apiUrl}/listar-recientes`); // Usa apiUrl como base
  }

  guardarCita(cita: CitaRq): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.apiUrl}/guardar`, cita); // Usa apiUrl como base
  }
}