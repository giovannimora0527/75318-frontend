import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Medicamento {
  id: number;
  nombre: string;
  presentacion: string;
  descripcion: string;
  fechaCompra: string;
  fechaVence: string;
  fechaCreacionRegistro: string;
  fechaModificacionRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiUrl = `${environment.apiUrl}/medicamento`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(`${this.apiUrl}/listar`);
  }

  guardar(medicamento: Medicamento): Observable<Medicamento> {
    return this.http.post<Medicamento>(`${this.apiUrl}/guardar`, medicamento);
  }

  actualizar(id: number, medicamento: Medicamento): Observable<Medicamento> {
    return this.http.put<Medicamento>(`${this.apiUrl}/actualizar/${id}`, medicamento);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}
