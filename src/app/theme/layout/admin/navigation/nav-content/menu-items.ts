import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'   // <- Esto lo registra automáticamente para toda la app
})
export class MenuItems {
  getAll(): Array<any> {
    return [
      {
        label: 'Gestión Clínica',
        main: [
          { state: 'usuario', name: 'Usuarios', type: 'link', icon: 'feather icon-users' },
          { state: 'medico', name: 'Médicos', type: 'link', icon: 'feather icon-user' },
          { state: 'paciente', name: 'Pacientes', type: 'link', icon: 'feather icon-user-check' },
          { state: 'citas', name: 'Citas', type: 'link', icon: 'feather icon-calendar' },
          { state: 'medicamentos', name: 'Medicamentos', type: 'link', icon: 'feather icon-layers' },
          { state: 'formulas-medicas', name: 'Fórmulas Médicas', type: 'link', icon: 'feather icon-file-text' },
          { state: 'historias-medicas', name: 'Historias Médicas', type: 'link', icon: 'feather icon-book-open' }
        ]
      }
    ];
  }
}

