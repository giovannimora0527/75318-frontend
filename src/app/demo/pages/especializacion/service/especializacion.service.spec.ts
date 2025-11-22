import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EspecializacionService } from './especializacion.service';
import { Especializacion } from '../models/especializacion';
import { RespuestaRs } from 'src/app/demo/pages/usuario/models/respuesta-rs';

describe('EspecializacionService', () => {
  let service: EspecializacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EspecializacionService]
    });
    service = TestBed.inject(EspecializacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list especializaciones', () => {
    const mockEspecializaciones: Especializacion[] = [
      { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', fechaCreacion: new Date(), activo: true }
    ];

    service.listarEspecializaciones().subscribe(especializaciones => {
      expect(especializaciones).toEqual(mockEspecializaciones);
    });

    const req = httpMock.expectOne(`${service.urlBase}/${service.endpoint}/listar`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEspecializaciones);
  });

  it('should save especializacion', () => {
    const mockEspecializacion: Especializacion = { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', fechaCreacion: new Date(), activo: true };
    const mockResponse: RespuestaRs = { mensaje: 'Guardado exitosamente', status: 200 };

    service.guardarEspecializacion(mockEspecializacion).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.urlBase}/${service.endpoint}/guardar`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update especializacion', () => {
    const mockEspecializacion: Especializacion = { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', fechaCreacion: new Date(), activo: true };
    const mockResponse: RespuestaRs = { mensaje: 'Actualizado exitosamente', status: 200 };

    service.actualizarEspecializacion(mockEspecializacion).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.urlBase}/${service.endpoint}/actualizar`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should search by code', () => {
    const mockEspecializacion: Especializacion = { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', fechaCreacion: new Date(), activo: true };

    service.buscarPorCodigo('CARD').subscribe(especializacion => {
      expect(especializacion).toEqual(mockEspecializacion);
    });

    const req = httpMock.expectOne(`${service.urlBase}/${service.endpoint}/buscar-por-codigo?codigo=CARD`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEspecializacion);
  });
});
