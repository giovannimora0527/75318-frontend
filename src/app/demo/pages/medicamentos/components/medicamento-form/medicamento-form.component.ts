import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicamentoService } from '../../medicamento.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento-form',
  templateUrl: './medicamento-form.component.html',
  styleUrls: ['./medicamento-form.component.scss']
})
export class MedicamentoFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private medicamentoService: MedicamentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      presentacion: ['', Validators.required],
      fechaCompra: ['', Validators.required],
      fechaVence: ['', Validators.required],
    });

    if (this.id) {
      this.editMode = true;
      this.medicamentoService.buscarPorId(this.id).subscribe({
        next: data => this.form.patchValue(data),
        error: () => Swal.fire('Error', 'No se pudo cargar el medicamento', 'error')
      });
    }
  }

  guardar() {
    if (this.form.invalid) {
      Swal.fire('Atención', 'Completa todos los campos', 'warning');
      return;
    }

    const medicamento = { ...this.form.value, id: this.id };

    const request = this.editMode
      ? this.medicamentoService.actualizarMedicamento(medicamento)
      : this.medicamentoService.guardarMedicamento(medicamento);

    request.subscribe({
      next: () => {
        Swal.fire('Éxito', `Medicamento ${this.editMode ? 'actualizado' : 'registrado'} correctamente`, 'success')
          .then(() => this.router.navigate(['/medicamentos']));
      },
      error: () => Swal.fire('Error', 'No se pudo guardar el medicamento', 'error')
    });
  }
}
