import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especializacion } from '../models/especializacion';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  private apiUrl = 'http://localhost:8000/clinica/v1/especializacion';

  constructor(private http: HttpClient) {}

  // Listar todas las especializaciones
  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.http.get<Especializacion[]>(`${this.apiUrl}/listar`);
  }

  // Crear especialización
  crearEspecializacion(especializacion: Especializacion): Observable<Especializacion> {
    return this.http.post<Especializacion>(`${this.apiUrl}/crear`, especializacion);
  }

  // Actualizar especialización
  actualizarEspecializacion(id: number, especializacion: Especializacion): Observable<Especializacion> {
    return this.http.put<Especializacion>(`${this.apiUrl}/actualizar/${id}`, especializacion);
  }

  // Buscar por código
  buscarPorCodigo(codigo: string): Observable<Especializacion> {
    return this.http.get<Especializacion>(`${this.apiUrl}/buscar-por-codigo?codigo=${codigo}`);
  }
}
