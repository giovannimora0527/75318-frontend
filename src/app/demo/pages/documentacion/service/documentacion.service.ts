import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Servicio para obtener la documentación del sistema desde el backend.
 * 
 * @remarks
 * Este servicio se comunica con el endpoint de documentación del backend
 * para obtener información completa sobre el sistema, incluyendo arquitectura,
 * diagramas UML, endpoints disponibles y análisis técnico.
 * 
 * @example
 * ```typescript
 * documentacionService.obtenerDocumentacion().subscribe(doc => {
 *   console.log(doc);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentacionService {
  private urlBase = environment.apiUrl;
  private endpoint = 'documentacion';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la documentación completa del sistema.
   * 
   * @returns Observable con la documentación del sistema
   */
  obtenerDocumentacion(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.get<any>(`${this.urlBase}/${this.endpoint}/sistema`, { headers });
  }
}

