import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService, ModalUploadService } from '../../services/services.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit() { }

  guardar(usuario: Usuario) {

    this.usuario.nombre = usuario.nombre;

    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }

    this.usuarioService.actualizarUsuario(this.usuario).subscribe(() => { }, err => {
      Swal.fire('Error en la actualización', err.message || err.error.errors.message, 'error');
    });

  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }
}
