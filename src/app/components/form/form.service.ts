import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) {


    // this.obtenerFormulario('formPropiedad').subscribe((data: respForm) => {
    //   this.forms.push(data.form[0]);
    //   console.log(data);
    // });

  }

  buscarLocalidad(event) {
    console.log('EVENTO EN EL SERVICIO', event);
    const url = URL_SERVICIOS + '/buscar/localidades/' + event;
    return this.http.get(url);
  }

}
