import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formula } from '../model/formula';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  private baseUrl = 'http://localhost:8000/clinica/v1/api/receta';

  constructor(private http: HttpClient) {}

  listar(): Observable<Formula[]> {
    return this.http.get<Formula[]>(`${this.baseUrl}/listar`);
  }

  guardar(formula: Formula): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.baseUrl}/guardar`, formula);
  }

  actualizar(formula: Formula): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.baseUrl}/actualizar`, formula);
  }

  eliminar(id: number): Observable<RespuestaRs> {
    return this.http.delete<RespuestaRs>(`${this.baseUrl}/eliminar/${id}`);
  }
}
