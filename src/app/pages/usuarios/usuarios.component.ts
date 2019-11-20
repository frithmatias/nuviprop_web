import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  // vars & flags
  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = false;

  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    // Me subscribo para recibir cualquier notificación que el evento emita y con
    // esa notificacion, actualizar la lista de usuarios con sus imagenes nuevas.
    this.modalUploadService.notificacion.subscribe(resp => {
      this.cargarUsuarios();
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.usuarioService
      .buscarUsuarios(termino)
      .subscribe((usuarios: Usuario[]) => {
        console.log('usuarios: ', usuarios);
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire(
        'No puede borrar usuario',
        'No se puede borrar a si mismo',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.usuarioService.borrarUsuario(usuario._id).subscribe(
          resp => {
            console.log(resp);
            this.cargarUsuarios();
          },
          err => {
            console.log('Error: ', err);
            Swal.fire('Error', err.error.errors.message, 'error');
          },
          () => {
            console.log('El observable esta detenido.');
          }
        );
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    Swal.fire({
      title: 'Confirme',
      text: 'Esta a punto de actualizar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.usuarioService.actualizarUsuario(usuario).subscribe(
          resp => {
            console.log(resp);
            this.cargarUsuarios();
          },
          err => {
            console.log('Error: ', err);
            Swal.fire('Error', err.error.errors.message, 'error');
          },
          () => {
            console.log('El observable esta detenido.');
          }
        );
      }
    });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }
}
