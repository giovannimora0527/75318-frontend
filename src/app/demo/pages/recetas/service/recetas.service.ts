import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecetaRq {
  citaId: number;
  medicamentoId: number;
  dosis: string;
  indicaciones?: string;
}

export interface RecetaRs {
  id: number;
  fechaCreacionRegistro: string;
  dosis: string;
  indicaciones?: string;
  citaId: number;
  medicamentoId: number;
  nombreMedicamento: string;
}

export interface RespuestaRs {
  mensaje: string;
  status: number;
}

export interface Cita {
  id: number;
  fechaHora: string;
  pacienteNombre?: string; // Campo esperado por el frontend
  nombreCompletoPaciente: string; // Campo devuelto por el backend
  medicoId?: number;
  nombreCompletoMedico?: string;
}

export interface Medicamento {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private readonly apiUrl = 'http://localhost:8000/clinica/v1/receta'; // URL base
  private readonly citasUrl = 'http://localhost:8000/clinica/v1/cita/listar-recientes'; // Endpoint para citas
  private readonly medicamentosUrl = 'http://localhost:8000/clinica/v1/medicamento/listar'; // Endpoint para medicamentos

  constructor(private readonly http: HttpClient) {}

  listarRecetas(): Observable<RecetaRs[]> {
    return this.http.get<RecetaRs[]>(`${this.apiUrl}/listar`);
  }

  guardarReceta(receta: RecetaRq): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.apiUrl}/guardar`, receta);
  }

  listarCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.citasUrl);
  }

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.medicamentosUrl);
  }
}