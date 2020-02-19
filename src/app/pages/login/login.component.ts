import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../services/services.index';
import { Usuario } from '../../models/usuario.model';
import { GAPI_UID } from '../../config/config';

import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	email: string;
	hidepass = true;
	recuerdame = false;
	auth2: any;
	constructor(public router: Router, public activatedRoute: ActivatedRoute, public usuarioService: UsuarioService) { }

	ngOnInit() {

		this.activatedRoute.params.subscribe(data => {
			if (data.id) {
				// Si dentro de login llega un id -> (login/activate/5e4d3d10ae99042780343f15)
				// El usuario viene del EMAIL de activación.
				this.activateUser(data.id).then(() => {
					this.router.navigate(['/login']);
				});
			}
		});


		this.googleInit();
		this.email = localStorage.getItem('email') || '';
		if (this.email.length > 1) {
			this.recuerdame = true;
		}
	}


	activateUser(uid: string) {
		return new Promise((resolve, reject) => {
			this.usuarioService
				.activate(uid)
				.subscribe(
					(activatedata: any) => {
						Swal.fire('¡Bienvenido!', activatedata.mensaje, 'success');
						resolve();
					},
					(err) => {
						Swal.fire('Error', err.error.errors.message, 'error');
						reject();
					}
				);
		})

	}
	// ==========================================================
	// LOGIN GOOGLE
	// ==========================================================

	googleInit() {
		gapi.load('auth2', () => {
			this.auth2 = gapi.auth2.init({
				client_id: GAPI_UID,
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
			this.usuarioService
				.loginGoogle(token)
				.subscribe(
					() => (window.location.href = '#/avisos'),
					err => Swal.fire('Error', err.error.mensaje, 'error')
				);
			// si mi backend valida las credenciales pasadas por el frontend, entonces me da el ok y me
			// redirecciona al dashboard.

			// Hay un problema con el template al redireccionar al dashboard desde el login de google y puedo solucionarlo
			// haciendo una redirección manual con Vanilla JS. Como uso el HASH # no estoy cargando nuevamente la aplicación.
			// this.router.navigate(['/avisos']);
		});
	}

	// ==========================================================
	// LOGIN NORMAL 
	// ==========================================================
	// TODO: Rehacer el formulario con formbuilder.
	ingresar(forma: NgForm) {
		if (forma.invalid) {
			return;
		}

		// En el modelo de datos, nombre, apellido y nacimiento, son necesarios, pero aca no los necesito
		// solo necesito email y password, en los que no necesito puedo enviar null.
		console.log(forma);
		console.log(forma.value);
		const usuario = new Usuario(
			forma.value.email,
			null,
			forma.value.password
		);

		this.usuarioService
			.login(usuario, forma.value.recuerdame)
			.subscribe(
				// seccion 17 clase 222, capturo el error de throwError del observable POST en el
				// servicio usuariosService metodo login()
				correcto => this.router.navigate(['/avisos']),
				err => Swal.fire('Error', err.error.mensaje, 'error')
			);
		// this.router.navigate([ '/avisos' ]);
	}

	cleanEmail(elementEmail, elementPassword) {
		elementEmail.value = null;
		elementPassword.value = null;
		if (localStorage.getItem('email')) {
			localStorage.removeItem('email');
		}
	}

}
