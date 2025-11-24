import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento } from '../models/medicamento';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private apiUrl = 'http://localhost:8000/clinica/v1/medicamento';

  constructor(private http: HttpClient) {}

  // Listar todos los medicamentos
  listarMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${this.apiUrl}/listar`);
  }

  // Buscar medicamento por ID
  buscarPorId(id: number): Observable<Medicamento> {
    return this.http.get<Medicamento>(`${this.apiUrl}/buscar`, {
      params: { id: id.toString() }
    });
  }

  // Guardar un nuevo medicamento
  guardarMedicamento(medicamento: Medicamento): Observable<Medicamento> {
    return this.http.post<Medicamento>(`${this.apiUrl}/guardar`, medicamento);
  }

  // Actualizar medicamento existente
  actualizarMedicamento(id: number, medicamento: Medicamento): Observable<Medicamento> {
    return this.http.put<Medicamento>(`${this.apiUrl}/actualizar/${id}`, medicamento);
  }

  // Eliminar medicamento
  eliminarMedicamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
