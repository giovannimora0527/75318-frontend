import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento, MedicamentoRq, RespuestaRs } from '../models/medicamento';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  urlBase = environment.apiUrl;
  endpoint: string = 'medicamento';

  constructor(private readonly backendService: BackendService) {}

  /**
   * Lista todos los medicamentos
   * GET /medicamento/listar
   */
  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  /**
   * Guarda un nuevo medicamento
   * POST /medicamento/crear
   */
  guardarMedicamento(medicamento: MedicamentoRq): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'crear', medicamento);
  }

  /**
   * Actualiza un medicamento existente
   * PUT /medicamento/actualizar/{id}
   */
  actualizarMedicamento(id: number, medicamento: MedicamentoRq): Observable<RespuestaRs> {
    return this.backendService.put(this.urlBase, this.endpoint, `actualizar/${id}`, medicamento);
  }
}