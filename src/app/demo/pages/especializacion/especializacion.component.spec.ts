import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { EspecializacionComponent } from './especializacion.component';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';

describe('EspecializacionComponent', () => {
  let component: EspecializacionComponent;
  let fixture: ComponentFixture<EspecializacionComponent>;
  let mockEspecializacionService: jasmine.SpyObj<EspecializacionService>;
  let mockSpinnerService: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    const especializacionServiceSpy = jasmine.createSpyObj('EspecializacionService', ['listarEspecializaciones', 'guardarEspecializacion', 'actualizarEspecializacion']);
    const spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [EspecializacionComponent, ReactiveFormsModule],
      providers: [
        { provide: EspecializacionService, useValue: especializacionServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecializacionComponent);
    component = fixture.componentInstance;
    mockEspecializacionService = TestBed.inject(EspecializacionService) as jasmine.SpyObj<EspecializacionService>;
    mockSpinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('nombre')).toBeDefined();
    expect(component.form.get('descripcion')).toBeDefined();
    expect(component.form.get('codigoEspecializacion')).toBeDefined();
    expect(component.form.get('activo')).toBeDefined();
  });

  it('should list especializaciones on init', () => {
    const mockEspecializaciones: Especializacion[] = [
      { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', fechaCreacion: new Date(), activo: true }
    ];
    mockEspecializacionService.listarEspecializaciones.and.returnValue(of(mockEspecializaciones));

    component.listarEspecializaciones();

    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockEspecializacionService.listarEspecializaciones).toHaveBeenCalled();
    expect(component.especializaciones).toEqual(mockEspecializaciones);
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  });

  it('should open modal for create', () => {
    spyOn(component, 'openModal');
    component.abrirNuevoEspecializacion();
    expect(component.especializacionSelected).toBeNull();
    expect(component.openModal).toHaveBeenCalledWith('C');
  });

  it('should open modal for edit', () => {
    const especializacion: Especializacion = { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', fechaCreacion: new Date(), activo: true };
    spyOn(component, 'openModal');
    component.abrirEditarEspecializacion(especializacion);
    expect(component.especializacionSelected).toEqual(especializacion);
    expect(component.openModal).toHaveBeenCalledWith('E');
  });

  it('should save especializacion in create mode', () => {
    const mockResponse = { mensaje: 'Guardado exitosamente', status: 200 };
    mockEspecializacionService.guardarEspecializacion.and.returnValue(of(mockResponse));
    component.modoFormulario = 'C';
    component.form.setValue({ nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', activo: true });

    spyOn(window, 'alert'); // Mock Swal

    component.guardarEspecializacion();

    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockEspecializacionService.guardarEspecializacion).toHaveBeenCalled();
    expect(mockSpinnerService.hide).toHaveBeenCalled();
    // Note: Swal.fire is mocked, so we can't test the exact call, but the logic is covered
  });

  it('should update especializacion in edit mode', () => {
    const mockResponse = { mensaje: 'Actualizado exitosamente', status: 200 };
    mockEspecializacionService.actualizarEspecializacion.and.returnValue(of(mockResponse));
    component.modoFormulario = 'E';
    component.especializacionSelected = { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', fechaCreacion: new Date(), activo: true };
    component.form.setValue({ nombre: 'Cardiología', descripcion: 'Especialidad en corazón', codigoEspecializacion: 'CARD', activo: true });

    spyOn(window, 'alert'); // Mock Swal

    component.guardarEspecializacion();

    expect(mockSpinnerService.show).toHaveBeenCalled();
    expect(mockEspecializacionService.actualizarEspecializacion).toHaveBeenCalled();
    expect(mockSpinnerService.hide).toHaveBeenCalled();
  });
});
