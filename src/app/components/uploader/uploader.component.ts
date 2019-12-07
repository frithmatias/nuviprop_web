import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUpload } from '../../models/fileupload.model';
import { UploadFileService } from '../../services/upload.service';
import { PropiedadesService } from 'src/app/services/services.index';
import { Propiedad } from 'src/app/models/propiedad.model';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']

})
export class UploaderComponent implements OnInit {
  @Input() propiedad: Propiedad;
  @Input() tipo: string;
  @Input() id: string;
  archivos: FileUpload[] = [];
  estaSobreElemento = false;

  constructor(public uploadService: UploadFileService, private propiedadesService: PropiedadesService) {

  }


  ngOnInit() {
    console.log(this.propiedad);
  }

  cargarImagenes() {
    this.archivos.forEach(archivo => {
      this.uploadService.subirImagen(archivo, this.tipo, this.id).then((data: any) => {
        console.log('ARCHIVO SUBIDO', data);
        this.propiedad.imgs = data.propiedad.imgs;

      });
    });
  }

  borrarImagenes() {
    this.archivos = [];
  }
  borrarImagen(id: string) {
    console.log(id);
  }
}
