

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion'; 
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-especializacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss' 
})
export class EspecializacionComponent implements OnInit {

 
  isLoading: boolean = false; 
  isSaving: boolean = false;  
  
  
  especializacionList: Especializacion[] = [];
  filtroGlobal: string = ''; 
  
  
  modalInstance: Modal | null = null;
  titleModal: string = 'Gestionar Especialización';
  titleBoton: string = 'Guardar';
  especializacionForm: FormGroup;

  constructor(
    private readonly especializacionService: EspecializacionService,
    private fb: FormBuilder 
  ) {
    this.especializacionForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      codigoEspecializacion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const modalElement = document.getElementById('modalEspecializacion');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, { keyboard: true });
    }
    
    this.listarEspecializaciones();
  }

  get especializacionesFiltradas(): Especializacion[] {
    
    if (!this.filtroGlobal) {
      return this.especializacionList;
    }
    const filtro = this.filtroGlobal.toLowerCase();
    
    return this.especializacionList.filter(esp => {
      const searchString = [
        esp.id,
        esp.nombre,
        esp.descripcion,
        esp.codigoEspecializacion
      ].join(' ').toLowerCase();

      return searchString.includes(filtro);
    });
  }

  listarEspecializaciones(): void {
    this.isLoading = true; 
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.especializacionList = data;
        this.isLoading = false; 
      },
      error: (error) => {
        this.isLoading = false; 
        Swal.fire('Error', 'Error al cargar la lista de especializaciones.', 'error');
        console.error('Error al listar especializaciones:', error);
      }
    });
  }

  nuevaEspecializacion() {
    this.titleModal = 'Registrar Nueva Especialización';
    this.titleBoton = 'Guardar';
    this.especializacionForm.reset(); 
    this.showModal();
  }

  editarEspecializacion(especializacion: Especializacion) {
    this.titleModal = 'Editar Especialización (ID: ' + especializacion.id + ')';
    this.titleBoton = 'Actualizar';
    this.especializacionForm.patchValue(especializacion);
    this.showModal();
  }
  
  guardarEspecializacion(): void {
    if (this.especializacionForm.invalid) {
      Swal.fire('Atención', 'Por favor, complete todos los campos requeridos.', 'warning');
      this.especializacionForm.markAllAsTouched(); 
      return;
    }

    this.isSaving = true; 
    const especializacionData: Especializacion = this.especializacionForm.value;

    this.especializacionService.guardarOActualizar(especializacionData).subscribe({
      next: (data) => {
        this.isSaving = false; 
        this.closeModal();
        
        const mensaje = especializacionData.id ? 'actualizada' : 'creada';
        Swal.fire('Éxito', `La especialización ha sido ${mensaje} correctamente.`, 'success');
        
        this.listarEspecializaciones(); 
      },
      error: (error) => {
        this.isSaving = false; 
        const errorMessage = error.error.message || 'Error desconocido al guardar la especialización.';
        Swal.fire('Error', errorMessage, 'error');
        console.error('Error al guardar/actualizar la especialización:', error);
      }
    });
  }

  
  confirmarEliminacion(id: number | undefined): void {
    if (!id) return;

    Swal.fire({
      title: '¿Está seguro?',
      text: "¡No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEspecializacion(id);
      }
    });
  }
  
  eliminarEspecializacion(id: number): void {
    this.isLoading = true; 
    
  }

  
  showModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
  
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.especializacionForm.reset(); 
    }
  }
}