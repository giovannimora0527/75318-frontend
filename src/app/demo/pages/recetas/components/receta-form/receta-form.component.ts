import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecetaService } from '../../services/receta.service';
import { RecetaRq } from '../../models/receta-rq.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receta-form',
  templateUrl: './receta-form.component.html',
  styleUrls: ['./receta-form.component.scss']
})
export class RecetaFormComponent implements OnInit {
  recetaForm!: FormGroup;
  loading = false;
  // Si quieres editar: podrías cargar la receta por id aquí (endpoint no implementado aún)

  constructor(
    private fb: FormBuilder,
    private recetaService: RecetaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recetaForm = this.fb.group({
      citaId: [null, [Validators.required]],
      medicamentoId: [null, [Validators.required]],
      dosis: ['', [Validators.required, Validators.maxLength(200)]],
      indicaciones: ['', [Validators.maxLength(500)]]
    });
  }

  get f() { return this.recetaForm.controls; }

  guardar() {
    if (this.recetaForm.invalid) {
      this.recetaForm.markAllAsTouched();
      return;
    }

    const payload: RecetaRq = this.recetaForm.value;
    this.loading = true;

    this.recetaService.guardarReceta(payload).subscribe({
      next: res => {
        this.loading = false;
        Swal.fire('Éxito', res?.mensaje || 'Receta registrada', 'success').then(() => {
          this.router.navigate(['/recetas']);
        });
      },
      error: err => {
        this.loading = false;
        Swal.fire('Error', err?.error?.mensaje || 'No se pudo guardar la receta', 'error');
      }
    });
  }
}
