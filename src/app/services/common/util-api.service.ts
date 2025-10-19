import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { Especializacion } from 'src/app/demo/pages/medico/models/especializacion';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';

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
}
