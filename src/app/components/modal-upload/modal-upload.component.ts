import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../../services/upload.service';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';
import { FileUpload } from 'src/app/models/fileupload.model';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: any;

  constructor(
    public uploadFileService: UploadFileService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() { }

  cerrarModal() {
    // si yo vuelvo a abrir el modal para cambiar la imagen de otro usuario,
    // voy a ver la imagen del usuario anterior, para evitarlo limpio las propiedades
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }

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

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    console.log('reader:', reader); // IMAGEN
    console.log('urlImagenTemp:', urlImagenTemp); // UNDEFINED
    reader.onloadend = () => (this.imagenTemp = reader.result);
  }

  subirImagen() {
    const imagenSubir = new FileUpload(this.imagenSubir);
    this.uploadFileService
      .subirImagen(
        imagenSubir,
        this.modalUploadService.tipo,
        this.modalUploadService.id
      )
      .then((resp: any) => {
        Swal.fire('Actualizado!', resp.mensaje, 'success');
        this.modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch(err => {
        console.log('Error en la carga... ');
      });
  }
}
