import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { RespuestaRs } from '../models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8000/clinica/v1/api/usuarios';

  constructor(private http: HttpClient) {}

  // Listar todos los usuarios
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  // Buscar usuario por username
  buscarPorUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/username/${username}`);
  }

  // Buscar usuarios por rol
  buscarPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/rol/${rol}`);
  }

  // Buscar usuarios por estado
  buscarPorEstado(estado: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/estado/${estado}`);
  }

  // Crear usuario
  guardarUsuario(usuario: Usuario): Observable<RespuestaRs> {
    return this.http.post<RespuestaRs>(`${this.apiUrl}`, usuario);
  }

  // Actualizar usuario
  actualizarUsuario(usuario: Usuario): Observable<RespuestaRs> {
    return this.http.put<RespuestaRs>(`${this.apiUrl}/${usuario.id}`, usuario);
  }
}
