import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:8000/clinica/v1/paciente';

  constructor(private http: HttpClient) {}

  listarPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  buscarPorDocumento(numeroDocumento: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar`, {
      params: { numeroDocumento }
    });
  }

  listarPorFechaNacimiento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fechaNacimiento`);
  }
}
