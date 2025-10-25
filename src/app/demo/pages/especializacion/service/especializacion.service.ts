import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion, EspecializacionRq, EspecializacionCreate } from '../models/especializacion';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  urlBase = environment.apiUrl;
  endpoint: string = 'especializacion';

  constructor(private readonly backendService: BackendService) {}

  /**
   * Lista todas las especializaciones
   * GET /especializacion/listar
   */
  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  /**
   * Busca una especialización por código
   * GET /especializacion/buscar-por-codigo?codigo=ABC123
   */
  buscarPorCodigo(codigo: string): Observable<Especializacion> {
    const params = new HttpParams().set('codigo', codigo);
    return this.backendService.get(this.urlBase, this.endpoint, 'buscar-por-codigo', params);
  }

  /**
   * Crea una nueva especialización
   * POST /especializacion/crear
   */
  crearEspecializacion(especializacion: EspecializacionCreate): Observable<Especializacion> {
    return this.backendService.post(this.urlBase, this.endpoint, 'crear', especializacion);
  }

  /**
   * Actualiza una especialización existente
   * PUT /especializacion/actualizar/{id}
   */
  actualizarEspecializacion(id: number, especializacion: EspecializacionCreate): Observable<Especializacion> {
    return this.backendService.put(this.urlBase, this.endpoint, `actualizar/${id}`, especializacion);
  }
}