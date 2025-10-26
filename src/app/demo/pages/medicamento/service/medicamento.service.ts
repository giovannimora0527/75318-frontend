import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';
import { Medicamento } from '../models/medicamento';
@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  urlBase = environment.apiUrl;
  endpoint: string = 'medicamento';

  constructor(private readonly backendService: BackendService) {}

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, this.endpoint, 'listar');
  }

  guardarMedicamento(medicamento: Medicamento): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', medicamento);
  }

  actualizarMedicamento(medicamento: Medicamento): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', medicamento);
  }
}
