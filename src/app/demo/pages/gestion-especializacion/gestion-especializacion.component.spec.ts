import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEspecializacionComponent } from './gestion-especializacion.component';

describe('GestionEspecializacionComponent', () => {
  let component: GestionEspecializacionComponent;
  let fixture: ComponentFixture<GestionEspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEspecializacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
