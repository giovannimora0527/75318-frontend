// src/app/demo/pages/cita/service/cita.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8000/clinica/v1/api/cita';

  constructor(private http: HttpClient) { }

  listarCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/listar`);
  }

  guardarCita(cita: Cita): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.apiUrl}/guardar`, cita);
  }

  actualizarCita(cita: Cita): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.apiUrl}/actualizar`, cita);
  }

  eliminarCita(id: number): Observable<RespuestaRs> {
    return this.http.delete<RespuestaRs>(`${this.apiUrl}/eliminar/${id}`);
  }
}
