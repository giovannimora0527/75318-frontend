import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { Especializacion } from "src/app/demo/pages/especializacion/models/especializacion";

import { Cita } from 'src/app/demo/pages/cita/models/cita';
import { Medicamento } from 'src/app/demo/pages/medicamento/models/medicamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilApiService {
  urlBase = environment.apiUrl;

  constructor(private readonly backendService: BackendService) { }

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, 'especializacion', 'listar');
  }

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, 'cita', 'listar');
  }

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, 'medicamento', 'listar');
  }
}
