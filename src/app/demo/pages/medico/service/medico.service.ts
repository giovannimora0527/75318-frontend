import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';

<<<<<<< HEAD
=======

>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  urlBase = environment.apiUrl;
  endpoint: string = 'medico';

  constructor(private readonly backendService: BackendService) {}

  listarMedicos(): Observable<Medico[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

<<<<<<< HEAD
=======
    /**
   * Guarda un nuevo médico
   * @param medico Datos del médico a guardar
   */
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  guardarMedico(medico: Medico): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', medico);
  }

<<<<<<< HEAD
=======
  /**
   * Actualiza un médico existente
   * @param medico Datos del médico a actualizar
   */
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  actualizarMedico(medico: Medico): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', medico);
  }
}
