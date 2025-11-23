import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/page-response'; 
import { AuditoriaLog } from '../models/auditoria-log'; 

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private apiUrl = 'http://localhost:8081/clinica/v1/auditoria'; 

  constructor(private http: HttpClient) { }

  buscarConFiltros(filtro: any): Observable<PageResponse<AuditoriaLog>> {
    return this.http.post<PageResponse<AuditoriaLog>>(`${this.apiUrl}/buscar`, filtro);
  }
}