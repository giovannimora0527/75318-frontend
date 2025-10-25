import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento } from '../models/medicamento';
import { RespuestaRs } from '../../usuario/models/respuesta-rs';

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

  guardarMedicamento(m: Medicamento): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'guardar', m);
  }

  actualizarMedicamento(m: Medicamento): Observable<RespuestaRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'actualizar', m);
  }
}