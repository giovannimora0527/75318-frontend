import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicamentosService, MedicamentoRs, MedicamentoRq } from './service/medicamentos.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-medicamentos',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './medicamentos.component.html',
	styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent {
	medicamentosList: MedicamentoRs[] = [];

	// modal/ui
	titleModal = '';
	titleBoton = '';
	modoFormulario: 'C' | 'E' | '' = '';
	medicamentoSelected: MedicamentoRs | null = null;
	modalInstance: Modal | null = null;

	// form
	form!: FormGroup;
	guardando = false;

	constructor(
		private readonly medicamentosService: MedicamentosService,
		private readonly fb: FormBuilder
	) {
		this.crearFormularioVacio();
		this.listarMedicamentos();
	}

	private crearFormularioVacio() {
		this.form = this.fb.group({
			nombre:        [null, [Validators.required, Validators.maxLength(100)]],
			descripcion:   [null, [Validators.required]],
			presentacion:  [null, [Validators.required, Validators.maxLength(100)]],
			fechaCompra:   [null, Validators.required],
			fechaVence:    [null, Validators.required]
		});
	}

	listarMedicamentos() {
		this.medicamentosService.listarMedicamentos().subscribe({
			next: (data) => this.medicamentosList = data,
			error: (error) => console.error('Error fetching medicamentos list:', error)
		});
	}

	abrirNuevoMedicamento() {
		this.titleModal = 'Crear Medicamento';
		this.titleBoton = 'Guardar Medicamento';
		this.modoFormulario = 'C';
		this.medicamentoSelected = null;

		this.form.reset();
		this.form.enable();
		this.abrirModal();
	}

	editarModalMedicamento(medicamento: MedicamentoRs) {
		this.titleModal = 'Editar Medicamento';
		this.titleBoton = 'Actualizar Medicamento';
		this.modoFormulario = 'E';
		this.medicamentoSelected = medicamento;

		this.form.patchValue({
			nombre: medicamento.nombre,
			descripcion: medicamento.descripcion,
			presentacion: medicamento.presentacion,
			fechaCompra: medicamento.fechaCompra,
			fechaVence: medicamento.fechaVence
		});
		this.form.enable();
		this.abrirModal();
	}

	abrirModal() {
		const el = document.getElementById('modalCrearMedicamento');
		if (!el) return;
		this.modalInstance ??= new Modal(el);
		this.modalInstance.show();

		el.addEventListener('hidden.bs.modal', () => {
			this.form.markAsPristine();
			this.form.markAsUntouched();
		}, { once: true });
	}

	closeModal() {
		this.modalInstance?.hide();
	}

	guardarMedicamento() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			Swal.fire('Error', 'Por favor, corrige los errores en el formulario.', 'error');
			this.guardando = false;
			return;
		}

		this.guardando = true;

		const body: MedicamentoRq = {
			id: this.medicamentoSelected?.id || undefined,
			nombre: this.form.getRawValue().nombre?.trim(),
			descripcion: this.form.getRawValue().descripcion?.trim(),
			presentacion: this.form.getRawValue().presentacion?.trim(),
			fechaCompra: this.form.getRawValue().fechaCompra,
			fechaVence: this.form.getRawValue().fechaVence
		};

		const obs = this.modoFormulario === 'E'
			? this.medicamentosService.actualizarMedicamento(body)
			: this.medicamentosService.guardarMedicamento(body);

		obs.subscribe({
			next: (r) => {
				Swal.fire('Éxito', r?.mensaje || 'El medicamento se ha guardado correctamente.', 'success');
				this.closeModal();
				this.listarMedicamentos();
			},
			error: (e) => {
				console.error(e);
				const msg = e?.error?.message || e?.error || 'Error guardando el medicamento.';
				Swal.fire('Error', msg, 'error');
				this.guardando = false;
			},
			complete: () => {
				this.guardando = false;
			}
		});
	}

	eliminarMedicamento(medicamento: MedicamentoRs) {
		Swal.fire({
			title: '¿Eliminar medicamento?',
			text: `¿Seguro que deseas eliminar el medicamento "${medicamento.nombre}"?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		}).then(result => {
			if (result.isConfirmed) {
				this.medicamentosService.eliminarMedicamento(medicamento.id).subscribe({
					next: (r) => {
						Swal.fire('Eliminado', r?.mensaje || 'Medicamento eliminado.', 'success');
						this.listarMedicamentos();
					},
					error: (e) => {
						console.error(e);
						const msg = e?.error?.message || e?.error || 'Error eliminando el medicamento.';
						Swal.fire('Error', msg, 'error');
					}
				});
			}
		});
	}
}
