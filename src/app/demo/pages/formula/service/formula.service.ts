import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formula } from '../models/formula';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  private apiUrl = 'http://localhost:8000/clinica/v1/receta';

  constructor(private http: HttpClient) {}

  // Crear una nueva fórmula
  crearFormula(formula: Formula): Observable<Formula> {
    return this.http.post<Formula>(`${this.apiUrl}/crear`, formula);
  }

  // Listar todas las fórmulas
  listarFormulas(): Observable<Formula[]> {
    return this.http.get<Formula[]>(`${this.apiUrl}/listar`);
  }

  // Listar fórmulas por fecha de creación descendente
  listarFormulasPorFechaDesc(): Observable<Formula[]> {
    return this.http.get<Formula[]>(`${this.apiUrl}/listar-desc`);
  }

  // Buscar fórmulas por id de cita
  buscarFormulasPorCitaId(citaId: number): Observable<Formula[]> {
    return this.http.get<Formula[]>(`${this.apiUrl}/cita/${citaId}`);
  }

  // Actualizar fórmula existente
  actualizarFormula(formula: Formula): Observable<Formula> {
    return this.http.put<Formula>(`${this.apiUrl}/actualizar/${formula.id}`, formula);
  }

  // Eliminar fórmula por id
  eliminarFormula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
