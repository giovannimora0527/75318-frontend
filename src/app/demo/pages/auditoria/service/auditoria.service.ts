import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from '../model/auditoria.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private baseUrl = 'http://localhost:8000/api/auditoria';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders() {
    return { headers: { Authorization: `Bearer ${this.auth.getToken()}` } };
  }

  listarAuditorias(
    usuario?: string,
    tipoEvento?: string,
    fecha?: string
  ): Observable<Auditoria[]> {
    let params = new HttpParams();
    if (usuario) params = params.set('usuarioFiltro', usuario);
    if (tipoEvento) params = params.set('tipoEventoFiltro', tipoEvento);
    if (fecha) params = params.set('fechaFiltro', fecha);

    return this.http.get<Auditoria[]>(`${this.baseUrl}/listar`, {
      ...this.getHeaders(),
      params,
    });
  }
}
