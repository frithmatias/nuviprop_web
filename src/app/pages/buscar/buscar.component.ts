import { Component, OnInit } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { Propiedad } from 'src/app/models/propiedad.model';
import { Inmobiliaria } from 'src/app/models/inmobiliaria.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: []
})
export class BuscarComponent implements OnInit {

  usuarios: Usuario[] = [];
  propiedades: Propiedad[] = [];
  inmobiliarias: Inmobiliaria[] = [];

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {
      const termino = params.termino;
      this.buscar(termino);
    });
  }

  ngOnInit() { }
  buscar(termino: string) {
    const url = URL_SERVICIOS + '/buscar/' + termino;

    this.http.get(url).subscribe((resp: any) => {
      console.log(resp);
      this.usuarios = resp.usuarios;
      this.propiedades = resp.propiedades;
      this.inmobiliarias = resp.inmobiliarias;
    });
  }
}
