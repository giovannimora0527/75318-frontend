import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auditoria } from './model/auditoria.model';
import { AuditoriaService } from './service/auditoria.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
  auditorias: Auditoria[] = [];
  filterForm: FormGroup;

  constructor(private auditoriaService: AuditoriaService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      usuario: [''],
      tipoEvento: [''],
      fecha: [''],
    });
  }

  ngOnInit(): void {
    this.cargarAuditorias();
  }

  cargarAuditorias(): void {
    this.auditoriaService.listarAuditorias().subscribe((res) => {
      this.auditorias = res;
    });
  }

  filtrar(): void {
    const { usuario, tipoEvento, fecha } = this.filterForm.value;
    this.auditoriaService.listarAuditorias(usuario, tipoEvento, fecha).subscribe((res) => {
      this.auditorias = res;
    });
  }

  limpiarFiltros(): void {
    this.filterForm.reset();
    this.cargarAuditorias();
  }
}

