import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UploadFileService } from '../upload/upload-file.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
@Injectable()
export class UsuarioService implements OnDestroy {
  obsUploadImage: Subscription;
  token: string;
  usuario: Usuario;

  constructor(public http: HttpClient, public router: Router) {
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
        console.log(resp);
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      })
    );
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    console.log(token);
    return this.http.post(url, { token }).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
        return true;
      })
    );
  }

  estaLogueado() {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
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
    const url = URL_SERVICIOS + '/usuarios/' + usuario._id;

    // url += '?token=' + this.token;
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    console.log(usuario, headers);
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
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
        }

        Swal.fire('Usuario actualizado', usuario.nombre, 'success');

        return true;
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuarios?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
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

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    console.log('LOGOUT');
    this.router.navigate(['/login']);
  }
}
