import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import Modal from 'bootstrap/js/dist/modal'; 

@Component({
  selector: 'app-paciente',
  standalone: true,
  // CORRECCIÓN: Se añade FormsModule para habilitar [(ngModel)]
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements OnInit {

  // LISTADO Y FILTRO
  pacienteList: Paciente[] = [];
  filtroGlobal: string = ''; 
  private ultimoOrden: 'asc' | 'desc' | undefined = undefined; 

  // MODAL Y FORMULARIO
  pacienteSelected: Paciente | null = null;
  modalInstance: Modal | null = null;
  titleModal: string = 'Gestionar Paciente';
  titleBoton: string = 'Guardar';
  pacienteForm: FormGroup;

  constructor(
    private readonly pacienteService: PacienteService,
    private fb: FormBuilder 
  ) {
    this.pacienteForm = this.fb.group({
      id: [null],
      usuarioId: [1, Validators.required], 
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['M', Validators.required],
      telefono: [''],
      direccion: [''],
    });
  }

  ngOnInit(): void {
    const modalElement = document.getElementById('modalPaciente');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, { keyboard: true });
    }
    
    this.listarPacientes();
  }

  get pacientesFiltrados(): Paciente[] {
    if (!this.filtroGlobal) {
      return this.pacienteList;
    }
    const filtro = this.filtroGlobal.toLowerCase();
    
    return this.pacienteList.filter(paciente => {
      const searchString = [
        paciente.id,
        paciente.tipoDocumento,
        paciente.numeroDocumento,
        paciente.nombres,
        paciente.apellidos,
        paciente.fechaNacimiento, 
        paciente.telefono,
        paciente.direccion 
      ].join(' ').toLowerCase();

      return searchString.includes(filtro);
    });
  }


  listarPacientes(orden?: 'asc' | 'desc'): void {
    if (orden !== undefined) {
      this.ultimoOrden = orden;
    } 
    
    if (this.ultimoOrden) {
      this.pacienteService.listarPacientesXOrden(this.ultimoOrden).subscribe({
        next: (data) => {
          this.pacienteList = data;
        },
        error: (error) => {
          console.error('Error al ordenar la lista de pacientes:', error);
        }
      });
    } else {
      this.pacienteService.listarPacientes().subscribe({
        next: (data) => {
          this.pacienteList = data;
        },
        error: (error) => {
          console.error('Error al listar pacientes:', error);
        }
      });
    }
  }

  nuevoPaciente() {
    this.titleModal = 'Registrar Nuevo Paciente';
    this.titleBoton = 'Guardar';
    this.pacienteForm.reset({ usuarioId: 1, genero: 'M' }); 
    this.pacienteSelected = null;
    this.showModal();
  }

  editarModalPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    this.titleModal = 'Editar Paciente (ID: ' + paciente.id + ')';
    this.titleBoton = 'Actualizar';

    this.pacienteForm.patchValue(paciente);
    
    if (paciente.fechaNacimiento) {
      this.pacienteForm.get('fechaNacimiento')?.setValue(paciente.fechaNacimiento.substring(0, 10));
    }

    this.showModal();
  }
  
  
  showModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
  
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.pacienteForm.reset({ usuarioId: 1, genero: 'M' }); 
      this.pacienteSelected = null;
    }
  }

  guardarPaciente(): void {
    if (this.pacienteForm.invalid) {
      console.error('Formulario inválido. Revise los campos requeridos.');
      this.pacienteForm.markAllAsTouched(); 
      return;
    }

    const pacienteData = this.pacienteForm.value;

    this.pacienteService.guardarOActualizar(pacienteData).subscribe({
      next: (data) => {
        console.log('Paciente guardado/actualizado con éxito:', data);
        this.closeModal();
        
        this.listarPacientes(this.ultimoOrden); 
      },
      error: (error) => {
        console.error('Error al guardar/actualizar el paciente:', error);
      }
    });
  }
}
