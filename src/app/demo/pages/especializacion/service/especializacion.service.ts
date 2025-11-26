import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especializacion } from '../../medico/models/especializacion';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {

  private apiUrl = 'http://localhost:8000/clinica/v1/api/especializacion';

  constructor(private http: HttpClient) {}

  listar(): Observable<Especializacion[]> {
    return this.http.get<Especializacion[]>(`${this.apiUrl}/listar`);
  }

  buscarPorCodigo(codigo: string): Observable<Especializacion> {
    return this.http.get<Especializacion>(`${this.apiUrl}/buscar-por-codigo?codigo=${codigo}`);
  }

  guardar(especializacion: Especializacion): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.apiUrl}/guardar`, especializacion);
  }

  actualizar(especializacion: Especializacion): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.apiUrl}/actualizar`, especializacion);
  }

  eliminar(id: number): Observable<RespuestaRs> {
    return this.http.delete<RespuestaRs>(`${this.apiUrl}/eliminar/${id}`);
  }
}
