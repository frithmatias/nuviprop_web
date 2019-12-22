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
  pagina = 0;
  totalPropiedades = 0;


  constructor(
    private propiedadesService: PropiedadesService,
    private modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarPropiedades(0);
  }

  cargarPropiedades(n: number) {
    if (
      ((this.pagina === 0) && (n < 0)) ||
      (((this.pagina + 1) * 20 >= this.totalPropiedades) && (n > 0))
    ) {
      return;
    }
    this.pagina += n;
    this.cargando = true;
    this.propiedadesService
      .cargarPropiedades(this.pagina)
      .subscribe((props: Propiedades) => {
        this.propiedades = props.propiedades;
        this.totalPropiedades = props.total;
        this.cargando = false;
      });
  }

  buscarPropiedad(termino: string) {
    // /^[a-z0-9]+$/i
    // ^         Start of string
    // [a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
    // +         one or more times (change to * to allow empty string)
    // $         end of string
    // /i        case-insensitive



    console.log(termino.length);
    if (termino.length <= 0) {
      this.cargarPropiedades(0);
      return;
    }

    const regex = new RegExp(/^[a-z0-9]+$/i);
    if (regex.test(termino)) {
      this.cargando = true;
      this.propiedadesService.buscarPropiedad(termino).subscribe((resp: any) => {
        this.propiedades = resp.propiedades;
        this.cargando = false;
      });
    } else {
      console.log('Debe ingresar solo caracteres alfanuméricos.');
    }
  }

  borrarPropiedad(propiedad: Propiedad) {
    Swal.fire({
      // para evitar problemas de tipo en este metodo defino al prinicio, declare var swal: any;
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar ' + propiedad.tipoinmueble + ' en ' + propiedad.calle + ' ' + propiedad.altura,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, borrar propiedad.'
    }).then(result => {
      if (result.value) {
        console.log(result);
        this.cargando = true;
        this.propiedadesService
          .borrarPropiedad(propiedad._id)
          .subscribe((resp: any) => {
            Swal.fire(
              'Propiedad eliminada',
              'La propiedad ha sido borrada con éxito.',
              'success'
            );
            this.cargarPropiedades(0);
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
