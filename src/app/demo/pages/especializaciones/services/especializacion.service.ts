import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especializacion } from '../models/especializacion.model';
import { EspecializacionRq } from '../models/especializacion-rq.model';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  // Ajusta baseUrl/puerto si tu backend corre en otro sitio
  private baseUrl = 'http://localhost:8080/especializacion';

  constructor(private http: HttpClient) {}

  listar(): Observable<Especializacion[]> {
    return this.http.get<Especializacion[]>(`${this.baseUrl}/listar`);
  }

  buscarPorCodigo(codigo: string) {
    return this.http.get<Especializacion>(`${this.baseUrl}/buscar/${encodeURIComponent(codigo)}`);
  }

  guardar(payload: EspecializacionRq) {
    return this.http.post<any>(`${this.baseUrl}/guardar`, payload);
  }

  actualizar(id: number, payload: EspecializacionRq) {
    return this.http.put<any>(`${this.baseUrl}/actualizar/${id}`, payload);
  }
}
