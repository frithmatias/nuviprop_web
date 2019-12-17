import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  formulario: FormGroup;

  constructor(private http: HttpClient) {

  }

  obtenerFormulario(formname: string) {
    const url = URL_SERVICIOS + '/form/' + formname;
    return this.http.get(url);
  }

}
