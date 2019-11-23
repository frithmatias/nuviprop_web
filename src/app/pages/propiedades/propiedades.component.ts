import { Component, OnInit } from '@angular/core';
import {
  PropiedadesService,
  ModalUploadService
} from 'src/app/services/services.index';
import { Propiedad, Propiedades } from 'src/app/models/propiedad.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styles: []
})
export class PropiedadesComponent implements OnInit {
  propiedades: Propiedad[] = [];
  cargando = false;

  constructor(
    private propiedadesService: PropiedadesService,
    private modalUploadService: ModalUploadService
  ) {}

  ngOnInit() {
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    this.cargando = true;
    this.propiedadesService
      .cargarPropiedades()
      .subscribe((props: Propiedades) => {
        // console.log(props);
        this.propiedades = props.propiedads;
        this.cargando = false;
      });
  }

  buscarPropiedad(termino: string) {
    if (termino.length <= 0) {
      this.cargarPropiedades();
      return;
    }
    this.cargando = true;
    this.propiedadesService.buscarPropiedad(termino).subscribe((resp: any) => {
      this.propiedades = resp.propiedades;
      this.cargando = false;
    });
  }

  borrarPropiedad(propiedad: Propiedad) {
    Swal.fire({
      // para evitar problemas de tipo en este metodo defino al prinicio, declare var swal: any;
      title: 'Esta seguro?',
      text:
        'Esta a punto de borrar ' +
        propiedad.tipopropiedad +
        ' en ' +
        propiedad.calle +
        ' ' +
        propiedad.numero,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(result => {
      if (result) {
        // console.log(propiedad);
        this.cargando = true;
        this.propiedadesService
          .borrarPropiedad(propiedad._id)
          .subscribe((resp: any) => {
            Swal.fire(
              'Propiedad eliminada',
              'La propiedad ha sido borrada con éxito.',
              'success'
            );
            this.cargarPropiedades();
            this.cargando = false;
          });
      } else {
        console.log('NO BORRAR');
      }
    });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('propiedades', id);
  }
}
