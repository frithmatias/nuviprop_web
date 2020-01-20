import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService, ModalUploadService, UploaderService } from '../../services/services.index';
import Swal from 'sweetalert2';
import { FileUpload } from 'src/app/models/fileupload.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: any;

  constructor(
	public usuarioService: UsuarioService,
	public modalUploadService: ModalUploadService,
	public uploaderService: UploaderService

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

  // PRIMER FORMA DE SUBIR LA IMAGEN (HACIENDO CLICK EN LA IMAGEN SUBE A TRAVES DEL MODAL)
  mostrarModal(id: string) {
	this.modalUploadService.mostrarModal('usuarios', id);
  }

  // SEGUNDA FORMA DE SUBIR LA IMAGEN (HACIENDO CLICK EN EL BOTON, SUBE SIN MODAL PERO CON SUS MISMOS MÉTODOS)
  // LOS METODOS SELECCIONIMAGE() Y SUBIRIMAGEN() ESTAN SACADOS DEL COMPONENTE
  // MODAL-UPLOAD.COMPONENT.TS. En componentes donde la previsualización de la
  // imagen es grande y no necesita el modal, aplico sus métodos directamente sin
  // abrir el modal.
  seleccionImage(archivo: File) {
	console.log('ARCHIVO', archivo);
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

	// Imagen temporal base64 para previsualizar (reader.result)
	const reader = new FileReader();
	reader.readAsDataURL(archivo);
	reader.onloadend = () => (this.imagenTemp = reader.result);
  }

  subirImagen(uid: string) {
	const imagenSubir = new FileUpload(this.imagenSubir);
	this.uploaderService
		// .subirImagen(	imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
		.subirImagen(imagenSubir, 'usuarios', uid)
		.then((resp: any) => {
		Swal.fire('Actualizado!', resp.mensaje, 'success');
		this.modalUploadService.notificacion.emit(resp);
		// this.cerrarModal();
		})
		.catch(err => {
		console.log('Error en la carga:', err);
		});
  }
}
