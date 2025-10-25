import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.model';
import { RecetaRq } from '../models/receta-rq.model';
import { RespuestaRs } from '../models/respuesta-rs.model';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private baseUrl = 'http://localhost:8000/receta';

  constructor(private http: HttpClient) {}

  listarRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.baseUrl}/listar`);
  }

  guardarReceta(payload: RecetaRq) {
    return this.http.post<RespuestaRs>(`${this.baseUrl}/guardar`, payload);
  }
}
