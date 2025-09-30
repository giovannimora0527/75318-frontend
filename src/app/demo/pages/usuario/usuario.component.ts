import { Component } from '@angular/core';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from './models/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {

  usuarioList: Usuario[] = [];

  constructor(private readonly usuarioService: UsuarioService) {
    console.log('Usuarios Components Cargado');
    this.listarUsuarios();
  }

  listarUsuarios() {
    console.log('Listando Usuarios..');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {        
        this.usuarioList = data;
        console.log(this.usuarioList);
      },
      error: (error) => {
        console.error('Error al listar usuarios', error);
      }
    });
  }

  clickBotonEditar(usuario: Usuario) {    
    console.log(usuario);
  }


}
