import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Historia {
  id?: number;
  paciente_id: number;
  fechaCreacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {
  private apiUrl = `${environment.apiUrl}/historia`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Historia[]> {
    return this.http.get<Historia[]>(`${this.apiUrl}/listar`);
  }

  guardar(historia: Historia): Observable<Historia> {
    return this.http.post<Historia>(`${this.apiUrl}/guardar`, historia);
  }

  actualizar(id: number, historia: Historia): Observable<Historia> {
    return this.http.put<Historia>(`${this.apiUrl}/actualizar/${id}`, historia);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
