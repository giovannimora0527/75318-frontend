import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PacienteService, Paciente } from './service/paciente.service';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  pacienteList: Paciente[] = [];

  titleModal: string = "Nuevo Paciente";
  titleBoton: string = "Guardar";

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.listar().subscribe({
      next: (data) => {
        this.pacienteList = data;
        console.log('Pacientes cargados:', this.pacienteList);
      },
      error: (err) => console.error('Error al cargar pacientes', err)
    });
  }

  abrirNuevoPaciente() {
    this.titleModal = "Nuevo Paciente";
    this.titleBoton = "Guardar";
  }

  editarModalPaciente(paciente: Paciente) {
    this.titleModal = "Editar Paciente";
    this.titleBoton = "Actualizar";
  }

  guardarMedico() {
    console.log("Guardar paciente...");
  }
}
