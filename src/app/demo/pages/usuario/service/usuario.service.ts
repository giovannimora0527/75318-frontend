import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';
import { RespuestaRs } from '../models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly urlBase = environment.apiUrl;
  private readonly endpoint = 'usuario';

  constructor(private readonly backendService: BackendService) {}

  /**
   * 📋 Listar todos los usuarios
   */
  listarUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  /**
   * 💾 Guardar un nuevo usuario
   */
  guardarUsuario(usuario: Usuario): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', usuario);
  }

  /**
   * ✏️ Actualizar un usuario existente
   */
  actualizarUsuario(usuario: Usuario): Observable<RespuestaRs> {
    return this.backendService.put(this.urlBase, this.endpoint, `actualizar/${usuario.id}`, usuario);
  }

  /**
   * ❌ Eliminar un usuario por ID
   */
  eliminarUsuario(id: number): Observable<RespuestaRs> {
    return this.backendService.delete(this.urlBase, this.endpoint, `eliminar/${id}`);
  }

  /**
   * 🔍 Buscar un usuario por ID (opcional, por si lo necesitas)
   */
  obtenerPorId(id: number): Observable<Usuario> {
    return this.backendService.get(this.urlBase, this.endpoint, `buscar/${id}`);
  }
}
