import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
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
	logueado = false;
	favoritos = [];
	constructor(public http: HttpClient, public router: Router) {
		//
		console.log("Servicio de usuarios cargado!");
		this.cargarStorage();
		this.logueado = this.estaLogueado();
	}

	ngOnDestroy() {
		this.obsUploadImage.unsubscribe();
	}

	// CRUD 
	crearUsuario(usuario: Usuario) {
		const url = URL_SERVICIOS + '/usuarios';
		return this.http.post(url, usuario).pipe(
			map((resp: any) => {
				Swal.queue([{
					icon: 'success',
					title: `¡Bienvenido ${usuario.nombre}!`,
					confirmButtonText: 'Reenviar E-mail de activación.',
					text: `Revisa tu correo para activar tu cuenta.`,
					showLoaderOnConfirm: true,
					preConfirm: async () => {
						// http://localhost:3000/usuarios/sendactivationmail/5e4d638d77e1d532ac944429
						const emailurl = URL_SERVICIOS + '/usuarios/sendactivationmail/' + resp.usuario._id;
						return this.http.get(emailurl).toPromise()
							.then((data: any) => Swal.insertQueueStep(data.mensaje))
							.catch((err) => {
								Swal.insertQueueStep({
									icon: 'error',
									title: 'Sucedio un error',
									text: err.error.mensaje
								});
							});
					}
				}]);



				// Swal.fire({
				// 	title: `¡Bienvenido ${usuario.nombre}!`,
				// 	text: `Revisa tu correo para validar tu cuenta.`,
				// 	imageWidth: 600,
				// 	imageHeight: 260,
				// 	padding: '3em'
				// });







				return resp.usuario;
			})
		);
	}

	obtenerUsuario(uid: string) {
		const url = URL_SERVICIOS + '/usuarios/' + uid;
		const headers = new HttpHeaders({
			'x-token': this.token
		});
		return this.http.get(url, { headers }).pipe(
			map((resp: any) => {
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

	activate(id: string) {
		const url = URL_SERVICIOS + '/usuarios/activate/' + id;
		return this.http.get(url)
			.pipe(map(data => {
				return data;
			}),
				catchError(err => {
					return throwError(err);
				})
			)
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
				this.logueado = true;
				this.favoritos = resp.usuario.favoritos;
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
		return this.http.post(url, { token }).pipe(
			map((resp: any) => {
				this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
				this.logueado = true;
				this.favoritos = resp.usuario.favoritos;
				return true;
			}),
			// clase 222 seccion 17, manejo de errores
			catchError(err => {
				return throwError(err);
			})
		);
	}

	renuevaToken() {

		const url = URL_SERVICIOS + '/login/updatetoken';
		// url += '?token=' + this.token;

		const headers = new HttpHeaders({
			'x-token': this.token
		});

		return this.http.get(url, { headers })
			.pipe(map((resp: any) => {
				this.token = resp.token;
				localStorage.setItem('token', this.token);
			}));

	}

	estaLogueado() {
		// si no hay token el usuario no esta logueado
		if ((this.token.length < 5) || (typeof this.token === 'undefined') || (this.token === 'undefined')) {
			return false;
		}
		// si el usuario se logueo en algun momento verifico la expiracion del token
		const payload = JSON.parse(atob(this.token.split('.')[1]));
		const ahora = new Date().getTime() / 1000;
		if (payload.exp < ahora) {
			this.logout();
			return false; // token expirado
		} else {
			return true; // token valido
		}
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
		localStorage.setItem('token', token);
		localStorage.setItem('usuario', JSON.stringify(usuario));
		localStorage.setItem('menu', JSON.stringify(menu));

		this.usuario = usuario;
		this.token = token;
		this.menu = menu;
	}

	agregarFavorito(avisoid: string) {
		const url = URL_SERVICIOS + '/usuarios/addfavourite/' + this.usuario._id;

		// url += '?token=' + this.token;
		const headers = new HttpHeaders({
			'x-token': this.token
		});

		return this.http.put(url, { avisoid }, { headers }).pipe(
			map((resp: any) => {
				// this.usuario = resp.usuario;

				return resp;
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
		const url = URL_SERVICIOS + '/buscar/usuarios/' + termino;
		return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
	}

	logout() {
		this.usuario = null;
		this.token = '';
		this.menu = [];
		this.logueado = false;

		localStorage.removeItem('token');
		localStorage.removeItem('usuario');
		localStorage.removeItem('menu');

		this.router.navigate(['/avisos']);
	}


}
