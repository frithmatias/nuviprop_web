import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription, throwError } from 'rxjs';
import { OnDestroy } from '@angular/core';
@Injectable()
export class UsuarioService implements OnDestroy {
  obsUploadImage: Subscription;
  token: string;
  usuario: Usuario;
  menu: any[] = [];

  constructor(public http: HttpClient, public router: Router) {
    //
    this.cargarStorage();
  }

  ngOnDestroy() {
    this.obsUploadImage.unsubscribe();
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      }),
      // clase 222 seccion 17, manejo de errores
      catchError(err => {
        return throwError(err);
      })
    );
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    console.log(token);
    return this.http.post(url, { token }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
        return true;
      })
    );
  }

  // metodo usado por el loginguard
  estaLogueado() {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/user';
    console.log(usuario);
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        Swal.fire('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuarioss/' + usuario._id;

    // url += '?token=' + this.token;
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    return this.http.put(url, usuario, { headers }).pipe(
      map((resp: any) => {
        // this.usuario = resp.usuario;
        const usuarioDB: Usuario = resp.usuario;

        // los datos estan actualizados en la bd, pero no voy a ver los cambios
        // si no actualizo los datos en la localstorage

        // Este if es porque SOLO guardo los datos en la localstorage si estoy
        // actualizando datos PROPIOS. Si soy ADMIN y estoy cambiando datos en
        // la lista de usuarios NO tengo que guardar nada en la localstorage.
        if (usuario._id === this.usuario._id) {
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }

        Swal.fire('Usuario actualizado', usuario.nombre, 'success');

        return true;
      }),
      // seccion 17 clase 222, capturo el error con throwError en PROFILE.COMPONENT.TS
      catchError(err => {
        return throwError(err);
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuarios?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/usuarios/' + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    const url = URL_SERVICIOS + '/usuarios/' + id;

    const headers = new HttpHeaders({
      'x-token': this.token
    });
    // url += '?token=' + this.token;

    return this.http.delete(url, { headers }).pipe(
      map(resp => {
        Swal.fire(
          'Usuario borrado',
          'El usuario a sido eliminado correctamente',
          'success'
        );
        return true;
      })
    );
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }


}
