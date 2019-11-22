import { Component, OnInit } from '@angular/core';
import { Inmobiliaria } from '../../models/inmobiliaria.model';
import { InmobiliariaService } from '../../services/services.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

declare var swal: any;

@Component({
  selector: 'app-inmobiliarias',
  templateUrl: './inmobiliarias.component.html',
  styles: []
})
export class InmobiliariasComponent implements OnInit {
  inmobiliarias: Inmobiliaria[] = [];

  constructor(
    public inmobiliariaService: InmobiliariaService,
    public modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarInmobiliarias();

    this.modalUploadService.notificacion.subscribe(() =>
      this.cargarInmobiliarias()
    );
  }

  buscarInmobiliaria(termino: string) {
    if (termino.length <= 0) {
      this.cargarInmobiliarias();
      return;
    }

    this.inmobiliariaService
      .buscarInmobiliaria(termino)
      .subscribe(inmobiliarias => (this.inmobiliarias = inmobiliarias));
  }

  cargarInmobiliarias() {
    this.inmobiliariaService
      .cargarInmobiliarias()
      .subscribe(inmobiliarias => (this.inmobiliarias = inmobiliarias));
  }

  guardarInmobiliaria(inmobiliaria: Inmobiliaria) {
    this.inmobiliariaService.actualizarInmobiliaria(inmobiliaria).subscribe();
  }

  borrarInmobiliaria(inmobiliaria: Inmobiliaria) {
    console.log(inmobiliaria);
    this.inmobiliariaService
      .borrarInmobiliaria(inmobiliaria._id)
      .subscribe(() => this.cargarInmobiliarias());
  }

  crearInmobiliaria() {
    Swal.fire({
      title: 'Alta de Inmobiliaria',
      text: 'Ingrese el nombre de la inmobiliaria',
      input: 'text',
      icon: 'info',
      showCancelButton: true,
      buttons: true,
      dangerMode: true
    }).then((valor: any) => {
      console.log(valor.value);
      if (!valor.value || valor.value.length === 0) {
        return;
      }
      console.log(valor.value);
      this.inmobiliariaService
        .crearInmobiliaria(valor.value)
        .subscribe(() => this.cargarInmobiliarias());
    });
  }

  actualizarImagen(inmobiliaria: Inmobiliaria) {
    this.modalUploadService.mostrarModal('inmobiliarias', inmobiliaria._id);
  }
}
