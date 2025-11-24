import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Historia } from '../models/historia';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {
  private apiUrl = 'http://localhost:8000/clinica/v1/historia';

  constructor(private http: HttpClient) {}

  // Listar todas las historias
  listarHistorias(): Observable<Historia[]> {
    return this.http.get<Historia[]>(`${this.apiUrl}/listar`);
  }

  // Crear historia
  crearHistoria(historia: Historia): Observable<Historia> {
    return this.http.post<Historia>(`${this.apiUrl}/crear`, historia);
  }

  // Actualizar historia
  actualizarHistoria(historia: Historia): Observable<Historia> {
    return this.http.put<Historia>(`${this.apiUrl}/actualizar/${historia.id}`, historia);
  }

  // Buscar historia por ID
  obtenerHistoriaPorId(id: number): Observable<Historia> {
    return this.http.get<Historia>(`${this.apiUrl}/${id}`);
  }

  // Eliminar historia
  eliminarHistoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
