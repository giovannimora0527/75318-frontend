import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspecializacionListComponent } from './components/especializacion-list/especializacion-list.component';
import { EspecializacionFormComponent } from './components/especializacion-form/especializacion-form.component';

const routes: Routes = [
  { path: '', component: EspecializacionListComponent }, // Página principal (lista)
  { path: 'nuevo', component: EspecializacionFormComponent }, // Crear nueva especialización
  { path: 'editar/:id', component: EspecializacionFormComponent } // Editar especialización existente
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecializacionesRoutingModule {}
