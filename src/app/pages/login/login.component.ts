import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/services.index';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  recuerdame = false;
  auth2: any;

  constructor(public router: Router, public _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '717554163420-kchjsu6qpu55heqv8ri40hfc37m71m4l.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element) {
    // cuando hago click en el boton de Google, invoco el metodo attachClickHandler con el googleUser
    // dentro de googleUser, invoco el metodo getAuthResponse() para obtener el token que me devuevle
    // google, ese token se lo voy a pasar a mi backend, para que mi backend lo valide con Google.
    this.auth2.attachClickHandler(element, {}, googleUser => {
      // let profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;
      this._usuarioService
        .loginGoogle(token)
        .subscribe(() => (window.location.href = '#/dashboard'));
      // si mi backend valida las credenciales pasadas por el frontend, entonces me da el ok y me
      // redirecciona al dashboard.

      // Hay un problema con el template al redireccionar al dashboard desde el login de google y podemos solucionarlo
      // haciendo una redirección manual con Vanilla JS. Como uso el HASH # no estoy cargando nuevamente la aplicación.
      // this.router.navigate(['/dashboard']);
    });
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    // En el modelo de datos, nombre, apellido y nacimiento, son necesarios, pero aca no los necesito
    // solo necesito email y password, en los que no necesito puedo enviar null.
    const usuario = new Usuario(
      forma.value.email,
      null,
      null,
      null,
      forma.value.password
    );

    this._usuarioService
      .login(usuario, forma.value.recuerdame)
      .subscribe(
        // seccion 17 clase 222, capturo el error de throwError del observable POST en el
        // servicio usuariosService metodo login()
        correcto => this.router.navigate(['/dashboard']),
        err => Swal.fire('Error', err.error.mensaje, 'error')
      );
    // this.router.navigate([ '/dashboard' ]);
  }


}
