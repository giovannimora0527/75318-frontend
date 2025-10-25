import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicamentosRoutingModule } from './medicamentos-routing.module';
import { MedicamentoListComponent } from './components/medicamento-list/medicamento-list.component';
import { MedicamentoFormComponent } from './components/medicamento-form/medicamento-form.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MedicamentoListComponent,
    MedicamentoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MedicamentosRoutingModule
  ]
})
export class MedicamentosModule {}
