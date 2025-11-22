import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../usuario/models/usuario';
import { Paciente } from '../../paciente/models/paciente';
import { Medico } from '../../medico/models/medico';


@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'http://localhost:8000/api/admin';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders() {
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.auth.getToken()}` }) };
  }

  // Usuarios
    listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios/listar`, this.getHeaders());
}

  guardarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuario/guardar`, usuario, this.getHeaders());
  }

  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuario/actualizar`, usuario, this.getHeaders());
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuario/eliminar/${id}`, this.getHeaders());
  }

  // Pacientes
  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/pacientes/listar`, this.getHeaders());
  }

  // Médicos
  listarMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${this.baseUrl}/medicos/listar`, this.getHeaders());
  }
}
