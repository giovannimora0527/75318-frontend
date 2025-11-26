import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  private apiUrl = 'http://localhost:8000/clinica/v1/api/medicamento';

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar`);
  }

  guardar(medicamento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar`, medicamento);
  }

  actualizar(medicamento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/actualizar`, medicamento);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }

}
