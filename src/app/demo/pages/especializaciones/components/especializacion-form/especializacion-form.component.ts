import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecializacionService } from '../../services/especializacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especializacion-form',
  templateUrl: './especializacion-form.component.html',
  styleUrls: ['./especializacion-form.component.scss']
})
export class EspecializacionFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  modoEditar = false;
  idEditar: number | null = null;

  constructor(
    private fb: FormBuilder,
    private servicio: EspecializacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', [Validators.maxLength(500)]],
      codigoEspecializacion: ['', [Validators.required, Validators.maxLength(50)]]
    });

    // si viene id en ruta, cargar para editar
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEditar = true;
      this.idEditar = Number(idParam);
      this.cargarParaEditar(this.idEditar);
    }
  }

  cargarParaEditar(id: number) {
    this.loading = true;
    // No existe endpoint GET por id en tu backend según lo compartido.
    // Intentamos obtener por buscarPorCodigo si tu id coincide con codigo; si no, deberías exponer GET /especializacion/{id}.
    // Aquí haremos una carga tentativa: listamos y buscamos localmente por id.
    this.servicio.listar().subscribe({
      next: data => {
        const item = data.find(x => x.id === id);
        if (item) {
          this.form.patchValue({
            nombre: item.nombre,
            descripcion: item.descripcion,
            codigoEspecializacion: item.codigoEspecializacion
          });
        } else {
          Swal.fire('Atención', 'No se encontró la especialización para editar', 'warning');
          this.router.navigate(['/especializaciones']);
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar la especialización', 'error');
      }
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload = this.form.value;

    if (this.modoEditar && this.idEditar != null) {
      this.servicio.actualizar(this.idEditar, payload).subscribe({
        next: res => {
          this.loading = false;
          Swal.fire('Éxito', 'Especialización actualizada', 'success').then(() => {
            this.router.navigate(['/especializaciones']);
          });
        },
        error: err => {
          this.loading = false;
          Swal.fire('Error', err?.error?.mensaje || 'No se pudo actualizar', 'error');
        }
      });
    } else {
      this.servicio.guardar(payload).subscribe({
        next: res => {
          this.loading = false;
          Swal.fire('Éxito', 'Especialización creada', 'success').then(() => {
            this.router.navigate(['/especializaciones']);
          });
        },
        error: err => {
          this.loading = false;
          Swal.fire('Error', err?.error?.mensaje || 'No se pudo crear', 'error');
        }
      });
    }
  }
}
