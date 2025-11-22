import { TestBed } from '@angular/core/testing';

import { CitaService } from './cita.service';

describe('PacienteService', () => {
  let service: CitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
