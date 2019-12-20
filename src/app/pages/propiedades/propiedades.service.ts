import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Propiedades, Propiedad } from 'src/app/models/propiedad.model';
import { UsuarioService } from '../usuarios/usuarios.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {


  propiedades: Propiedad[] = [];
  propiedad: Propiedad;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  cargarPropiedades(pagina: number) {

    // si obtengo un salto + o -, pero caigo en un "desde" +, entonces paso de página.
    // if ((this.pagina + avance) >= 0) { this.pagina += avance; }

    let url = URL_SERVICIOS + '/propiedades';
    url += '?pagina=' + pagina;

    // console.log('URL', url);

    return this.http.get(url).pipe(map((propiedades: Propiedades) => {
      this.propiedades = propiedades.propiedades;
      return propiedades;
    }));
  }

  obtenerPropiedad(id: string) {
    const url = URL_SERVICIOS + '/propiedades/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.propiedad = resp.propiedad;
        return resp.propiedad;
      })
    );
  }

  buscarPropiedad(termino: string) {
    const url = URL_SERVICIOS + '/buscar/propiedades/' + termino;
    return this.http.get(url);
  }

  // guardar = crear o actualizar
  guardarPropiedad(propiedad: Propiedad, propId: string) {
    let url = URL_SERVICIOS + '/propiedades';
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    if (propId !== 'nuevo') {
      // actualizando
      url += '/' + propId;
      return this.http.put(url, propiedad, { headers }).pipe(
        map((resp: any) => {
          Swal.fire('Propiedad Actualizado', propiedad.calle, 'success');
          this.propiedad = resp.propiedad;
          return resp.propiedad;
        })
      );
    } else {
      // creando
      return this.http.post(url, propiedad, { headers }).pipe(
        map((resp: any) => {
          Swal.fire('Propiedad Creada', propiedad.calle, 'success');
          this.propiedad = resp.propiedad;
          return resp.propiedad;
        })
      );
    }
  }

  borrarPropiedad(id: string) {
    const url = URL_SERVICIOS + '/propiedades/' + id;
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });
    return this.http.delete(url, { headers });
  }


  scrollTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
}
