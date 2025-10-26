import { Pipe, PipeTransform } from '@angular/core';
import { Paciente } from './models/paciente';

@Pipe({
  name: 'filtroPacientes',
  standalone: true
})
export class FiltroPacientesPipe implements PipeTransform {
  transform(pacientes: Paciente[], filtros: any): Paciente[] {
    if (!pacientes) return [];
    return pacientes.filter(p => {
      return (
        (!filtros.id || p.id?.toString().toLowerCase().includes(filtros.id.toLowerCase())) &&
        (!filtros.tipoDocumento || p.tipoDocumento?.toLowerCase().includes(filtros.tipoDocumento.toLowerCase())) &&
        (!filtros.documento || p.numeroDocumento?.toLowerCase().includes(filtros.numeroDocumento.toLowerCase())) &&
        (!filtros.nombres || p.nombres?.toLowerCase().includes(filtros.nombres.toLowerCase())) &&
        (!filtros.apellidos || p.apellidos?.toLowerCase().includes(filtros.apellidos.toLowerCase())) &&
        (!filtros.telefono || p.telefono?.toLowerCase().includes(filtros.telefono.toLowerCase())) &&
        (!filtros.genero || p.genero?.toLowerCase().includes(filtros.genero.toLowerCase())) &&
        (!filtros.usuario || p.usuario?.username?.toLowerCase().includes(filtros.usuario.toLowerCase())) &&
        (!filtros.fechaNacimiento || p.fechaNacimiento?.toString().toLowerCase().includes(filtros.fechaNacimiento.toLowerCase())) &&
        (!filtros.direccion || p.direccion?.toLowerCase().includes(filtros.direccion.toLowerCase()))
      );
    });
  }
}
