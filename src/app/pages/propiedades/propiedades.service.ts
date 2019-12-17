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

  cargarPropiedades() {
    const url = URL_SERVICIOS + '/propiedades';
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
  guardarPropiedad(propiedad: Propiedad) {
    let url = URL_SERVICIOS + '/propiedades';
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    if (propiedad._id) {
      // actualizando
      url += '/' + propiedad._id;
      return this.http.put(url, propiedad, { headers }).pipe(
        map((resp: any) => {
          Swal.fire('Propiedad Actualizado', propiedad.calle, 'success');
          return resp.propiedad;
        })
      );
    } else {
      // creando
      return this.http.post(url, propiedad, { headers }).pipe(
        map((resp: any) => {
          Swal.fire('Propiedad Creada', propiedad.calle, 'success');
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
}
