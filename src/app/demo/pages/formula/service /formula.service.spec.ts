import { TestBed } from '@angular/core/testing';

import { RecetaService } from './formula.service';

describe('RecetaService', () => {
  let service: RecetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
