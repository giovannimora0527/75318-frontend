import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';

import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MedicosComponent } from './pages/medicos/medicos.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { MedicamentosComponent } from './pages/medicamentos/medicamentos.component';
import { CitasComponent } from './pages/citas/citas.component';
import { FormulasMedicasComponent } from './pages/formulas-medicas/formulas-medicas.component';
import { HistoriasMedicasComponent } from './pages/historias-medicas/historias-medicas.component';
import { EspecializacionesComponent } from './pages/especializaciones/especializaciones.component';

// 👇 AGREGA "export" AQUÍ
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' } },
      { path: 'medico', component: MedicoComponent, data: { title: 'Medico' } },
      { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' } },
      { path: 'usuarios', component: UsuariosComponent, data: { title: 'Usuarios' } },
      { path: 'medicos', component: MedicosComponent, data: { title: 'Medicos' } },
      { path: 'pacientes', component: PacientesComponent, data: { title: 'Pacientes' } },
      { path: 'medicamentos', component: MedicamentosComponent, data: { title: 'Medicamentos' } },
      { path: 'citas', component: CitasComponent, data: { title: 'Citas' } },
      { path: 'formulas-medicas', component: FormulasMedicasComponent, data: { title: 'Fórmulas Médicas' } },
      { path: 'historias-medicas', component: HistoriasMedicasComponent, data: { title: 'Historias Médicas' } },
      { path: 'especializaciones', component: EspecializacionesComponent, data: { title: 'Especializaciones' } }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


