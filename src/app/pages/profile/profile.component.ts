import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService, UploadFileService } from '../../services/services.index';
import Swal from 'sweetalert2';
import { FileUpload } from 'src/app/models/fileupload.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;

  imagenSubir: FileUpload;
  imagenTemp: any;

  constructor(
    public usuarioService: UsuarioService,
    private uploadFileService: UploadFileService
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
      // la ubicacion del mensaje de error en el objeto puede variar dependiendo del error en
      // este caso, si yo al actualizar un dato en el perfil, dejo un campo vacío la ubicacion
      // del mensaje de error es distinta a si yo obtengo un error porque la ruta del URL es
      // incorrecta.
      Swal.fire('Error en la actualización', err.message || err.error.errors.message, 'error');
    });
  }

  seleccionImage(archivo: FileUpload) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.archivo.type.indexOf('image') < 0) {
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
    const urlImagenTemp = reader.readAsDataURL(archivo.archivo);
    reader.onloadend = () => (this.imagenTemp = reader.result);
  }

  cambiarImagen() {
    // cambiarImagen() -> Ajax y Vanilla JS
    // cambiarImagen2() -> HttpClient
    this.uploadFileService
      .subirImagen(this.imagenSubir, 'usuarios', this.usuario._id)
      .then((resp: any) => {
        console.log(resp);

        Swal.fire(
          'Imagen Actualizada',
          this.usuarioService.usuario.nombre,
          'success'
        );
      })
      .catch(err => {
        console.log(err);
        Swal.fire('Error', 'err', 'error');
      });
  }
}
