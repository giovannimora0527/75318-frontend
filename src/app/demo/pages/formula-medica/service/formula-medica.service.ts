import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Modelo que representa la entidad Fórmula Médica
 */
export interface FormulaMedica {
  id?: number;
  descripcion: string;
  fechaEmision: string;  // formato ISO, ej: "2025-10-25"
  medicoId: number;
  pacienteId: number;
}

/**
 * Servicio para consumir los endpoints del backend relacionados con las fórmulas médicas.
 */
@Injectable({
  providedIn: 'root'
})
export class FormulaMedicaService {
  // ✅ Corregido: eliminada la doble ruta /clinica/v1
  private apiUrl = `${environment.apiUrl}/formula-medica`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las fórmulas médicas registradas
   */
  listar(): Observable<FormulaMedica[]> {
    return this.http.get<FormulaMedica[]>(`${this.apiUrl}/listar`);
  }

  /**
   * Guarda una nueva fórmula médica
   */
  guardar(formula: FormulaMedica): Observable<FormulaMedica> {
    // ✅ Convertimos medicoId y pacienteId a objetos anidados (como espera el backend)
    const payload = {
      descripcion: formula.descripcion,
      fechaEmision: formula.fechaEmision,
      medico: { id: formula.medicoId },
      paciente: { id: formula.pacienteId }
    };

    return this.http.post<FormulaMedica>(`${this.apiUrl}/guardar`, payload);
  }

  /**
   * Actualiza una fórmula médica existente
   */
  actualizar(id: number, formula: FormulaMedica): Observable<FormulaMedica> {
    const payload = {
      descripcion: formula.descripcion,
      fechaEmision: formula.fechaEmision,
      medico: { id: formula.medicoId },
      paciente: { id: formula.pacienteId }
    };

    return this.http.put<FormulaMedica>(`${this.apiUrl}/actualizar/${id}`, payload);
  }

  /**
   * Elimina una fórmula médica por su ID
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
