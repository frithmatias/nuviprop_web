import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) {


    // this.obtenerFormulario('formPropiedad').subscribe((data: respForm) => {
    //   this.forms.push(data.form[0]);
    //   console.log(data);
    // });

  }

  obtenerOperaciones() {
    const url = URL_SERVICIOS + '/data/operaciones';
    return this.http.get(url);
  }

  obtenerInmuebles() {
    const url = URL_SERVICIOS + '/data/inmuebles';
    return this.http.get(url);
  }

  obtenerUnidades(idparent: string) {
    const url = URL_SERVICIOS + '/data/unidades/' + idparent;
    return this.http.get(url);
  }

  buscarLocalidad(event) {
    console.log('EVENTO EN EL SERVICIO', event);
    const url = URL_SERVICIOS + '/buscar/localidades/' + event;
    return this.http.get(url);
  }

}
