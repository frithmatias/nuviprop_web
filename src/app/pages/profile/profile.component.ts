import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;

  imagenSubir: File;
  imagenTemp: any;

  constructor(public _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario;
    this.usuario.img = '5dc87bd8d5756a191422c938-324.png';
    this.usuario._id = '5dc87bd8d5756a191422c938';
    console.log(this.usuario);
  }

  ngOnInit() {}

  guardar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario(this.usuario).subscribe();
  }

  seleccionImage(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire(
        'Sólo imágenes',
        'El archivo seleccionado no es una imagen',
        'error'
      );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => (this.imagenTemp = reader.result);
  }

  cambiarImagen() {
    // cambiarImagen() -> Ajax y Vanilla JS
    // cambiarImagen2() -> HttpClient
    this._usuarioService.cambiarImagen2(
      this.imagenSubir,
      'usuarios',
      this.usuario._id
    );
  }
}
