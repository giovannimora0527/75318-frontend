import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
=======

>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
<<<<<<< HEAD
import { CitaComponent } from './demo/pages/cita/cita.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { FormulaComponent } from './demo/pages/formula/formula.component';
import { HistoriaComponent } from './demo/pages/historia/historia.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';
=======
import { CitasComponent } from './demo/pages/citas/citas.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { FormulasMedicasComponent } from './demo/pages/formulas-medicas/formulas-medicas.component';
import { HistoriasMedicasComponent } from './demo/pages/historias-medicas/historias-medicas.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
<<<<<<< HEAD
  },  
=======
  },
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [      
<<<<<<< HEAD
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }},
       { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},
       { path: 'cita', component: CitaComponent, data: { title: 'Cita' }},
       { path: 'medicamento', component: MedicamentoComponent, data: { title: 'Medicamento' }},
       { path: 'formula-medica', component: FormulaComponent, data: { title: 'Formula' }},
       { path: 'historia-clinica', component: HistoriaComponent, data: { title: 'Historia' }},
       { path: 'especializacion', component: EspecializacionComponent, data: { title: 'Especializacion' }}

=======
      { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }},
      { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
      { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},
      { path: 'citas', component: CitasComponent, data: { title: 'Citas' }},
      { path: 'especializacion', component: EspecializacionComponent, data: { title: 'Especializacion' }},
      { path: 'formulas-medicas', component: FormulasMedicasComponent, data: { title: 'Formulas Médicas' }},
      { path: 'historias-medicas', component: HistoriasMedicasComponent, data: { title: 'Historias Médicas' }},
      { path: 'medicamentos', component: MedicamentosComponent, data: { title: 'Medicamentos' }}
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
<<<<<<< HEAD
=======




>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
