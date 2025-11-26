import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Historia } from '../models/historia';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {

  private apiUrl = 'http://localhost:8000/clinica/v1/api/historia';

  constructor(private http: HttpClient) {}

  listar(): Observable<Historia[]> {
    return this.http.get<Historia[]>(`${this.apiUrl}/listar`);
  }

  guardar(historia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar`, historia);
  }

  actualizar(historia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/actualizar`, historia);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }
}
