import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento } from './medicamento.model';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private baseUrl = 'http://localhost:8080/medicamento';

  constructor(private http: HttpClient) {}

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${this.baseUrl}/listar`);
  }

  guardarMedicamento(medicamento: Medicamento): Observable<any> {
    return this.http.post(`${this.baseUrl}/guardar`, medicamento);
  }

  buscarPorId(id: number): Observable<Medicamento> {
    return this.http.get<Medicamento>(`${this.baseUrl}/buscar-por-id?id=${id}`);
  }

  actualizarMedicamento(medicamento: Medicamento): Observable<any> {
    return this.http.post(`${this.baseUrl}/actualizar`, medicamento);
  }
}
