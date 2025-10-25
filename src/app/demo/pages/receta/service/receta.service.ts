import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Receta, RecetaRq } from '../models/receta';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  urlBase = environment.apiUrl;
  endpoint: string = 'receta';

  constructor(private readonly backendService: BackendService) {}

  /**
   * Lista todas las recetas
   * GET /receta/recetas
   */
  listarRecetas(): Observable<Receta[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'recetas');
  }

  /**
   * Busca una receta por ID
   * GET /receta/receta/{id}
   */
  obtenerRecetaPorId(id: number): Observable<Receta> {
    return this.backendService.get(this.urlBase, this.endpoint, `receta/${id}`);
  }

  /**
   * Lista recetas por cita
   * GET /receta/por-receta?citaId=1
   */
  listarRecetasPorCita(citaId: number): Observable<Receta[]> {
    const params = new HttpParams().set('citaId', citaId.toString());
    return this.backendService.get(this.urlBase, this.endpoint, 'por-receta', params);
  }

  /**
   * Guarda una nueva receta
   * POST /receta/guardar-receta
   */
  guardarReceta(receta: RecetaRq): Observable<Receta> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar-receta', receta);
  }

  /**
   * Actualiza una receta existente
   * PUT /receta/actualizar-receta/{id}
   */
  actualizarReceta(id: number, receta: RecetaRq): Observable<Receta> {
    return this.backendService.put(this.urlBase, this.endpoint, `actualizar-receta/${id}`, receta);
  }

  /**
   * Elimina una receta
   * DELETE /receta/eliminar-receta/{id}
   */
  eliminarReceta(id: number): Observable<any> {
    return this.backendService.delete(this.urlBase, this.endpoint, `eliminar-receta/${id}`);
  }
}


