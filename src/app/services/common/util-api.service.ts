import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import { Paciente } from 'src/app/demo/pages/paciente/models/paciente';
import { Medico } from 'src/app/demo/pages/medico/models/medico';
import { Cita } from 'src/app/demo/pages/cita/models/cita';
import { Medicamento } from 'src/app/demo/pages/medicamento/models/medicamento';

@Injectable({
  providedIn: 'root'
})
export class UtilApiService {
  urlBase = environment.apiUrl;

  constructor(private readonly backendService: BackendService) {}

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get(this.urlBase, 'especializacion', 'listar');
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(this.urlBase, 'usuario', 'listar');
  }

  listarPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.urlBase, 'paciente', 'listar');
  }

  listarMedicos(): Observable<Medico[]> {
    return this.backendService.get(this.urlBase, 'medico', 'listar');
  }

  listarCitas(): Observable<Cita[]> {
    return this.backendService.get(this.urlBase, 'cita', 'listar');
  }

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.urlBase, 'medicamento', 'listar');
  }
}
