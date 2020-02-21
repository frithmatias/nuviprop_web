import { Injectable } from '@angular/core';
// import { URL_SERVICIOS } from 'src/environments/environment';
import { URL_SERVICIOS } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../../services/usuarios.service';
import { Avisos, Aviso } from 'src/app/models/aviso.model';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';

@Injectable({
	providedIn: 'root'
})
export class MisAvisosService {

	constructor(
		private http: HttpClient,
		private usuarioService: UsuarioService
	) { }

	cargarMisAvisos(pagina: number) {
		const uid = this.usuarioService.usuario._id;
		let url = URL_SERVICIOS;
		url += '/avisos/misavisos/' + uid + '?pagina=' + pagina;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});
		return this.http.get(url, { headers }).pipe(map((avisos: Avisos) => {
			return avisos;
		}));
	}

	cargarMisFavoritos(pagina: number, avisos: string) {

		let url = URL_SERVICIOS;
		url += '/avisos/misfavoritos/?pagina=' + pagina + '&avisos=' + avisos;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});
		return this.http.get(url, { headers }).pipe(map((avisos: Avisos) => {
			return avisos;
		}));
	}

	obtenerAviso(id: string) {
		const url = URL_SERVICIOS + '/avisos/' + id;
		return this.http.get(url).pipe(
			map((resp: any) => {
				return resp.aviso;
			})
		);
	}

	buscarAviso(termino: string) {
		const url = URL_SERVICIOS + '/buscar/avisos/' + termino;
		return this.http.get(url);
	}

	guardarAviso(dataform: any, avisoId: string) {
		// guardar = crear o actualizar

		let url = URL_SERVICIOS;
		url += '/avisos';
		// url += '/avisos/detalles';
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});

		if (avisoId !== 'nuevo') {
			// ----------------------------------------------------------------------
			// ACTUALIZAR
			// ----------------------------------------------------------------------
			url += '/' + avisoId;
			return this.http.put(url, dataform, { headers }).pipe(
				map((resp: any) => {
					Swal.fire({
						title: '¡Aviso actualizado!',
						text: dataform.calle + ' ' + dataform.altura,
						icon: 'success',
						timer: 1000
					});
					return resp;
				})
			);
		} else {
			// ----------------------------------------------------------------------
			// CREAR
			// ----------------------------------------------------------------------
			return this.http.post(url, dataform, { headers }).pipe(
				map((resp: any) => {
					Swal.fire({
						title: '¡Aviso creado!',
						text: dataform.calle + ' ' + dataform.altura,
						icon: 'success',
						timer: 1000
					});
					return resp;
				})
			);
		}
	}

	activarAviso(id: string) {
		let url = URL_SERVICIOS;
		url += '/avisos/pause/' + id;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});
		return this.http.put(url, {}, { headers }).pipe(
			map((resp: any) => {
				if (resp.aviso.activo) {
					Swal.fire({
						title: '¡Aviso activado!',
						icon: 'success',
						timer: 1000
					});
				} else {
					Swal.fire({
						title: '¡Aviso desactivado!',
						icon: 'success',
						timer: 1000
					});
				}
				return resp.aviso;
			})
		);
	}

	destacarAviso(id: string) {
		let url = URL_SERVICIOS;
		url += '/avisos/destacar/' + id;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});
		return this.http.put(url, {}, { headers }).pipe(
			map((resp: any) => {
				if (resp.aviso.destacado) {
					Swal.fire({
						title: '¡Aviso destacado!',
						icon: 'success',
						timer: 1000
					});
				} else {
					Swal.fire({
						title: '¡El aviso ya no esta destacado!',
						icon: 'success',
						timer: 1000
					});
				}
				return resp.aviso;
			})
		);
	}

	guardarDetalles(dataform: any, aviso: Aviso) {
		let url = URL_SERVICIOS;
		url += '/avisos/detalles/' + aviso._id;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});

		if (aviso.detalles) {
			// actualizando
			return this.http.put(url, dataform, { headers }).pipe(
				map((resp: any) => {
					Swal.fire({
						title: '¡Detalles actualizados!',
						text: dataform.calle + ' ' + dataform.altura,
						icon: 'success',
						timer: 1000
					});
					return resp;
				})
			);
		} else {
			// creando
			return this.http.post(url, dataform, { headers }).pipe(
				map((resp: any) => {
					Swal.fire({
						title: '¡Detalles creados!',
						text: dataform.calle + ' ' + dataform.altura,
						icon: 'success',
						timer: 1000
					});
					return resp;
				})
			);
		}
	}

	borrarAviso(id: string) {
		const url = URL_SERVICIOS + '/avisos/' + id;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});
		return this.http.delete(url, { headers });
	}

	scrollTop() {
		document.body.scrollTop = 0; // Safari
		document.documentElement.scrollTop = 0; // Other
	}

	stepperGoBack(stepper: MatStepper) {
		stepper.previous();
	}

	stepperGoNext(stepper: MatStepper) {
		this.scrollTop();
		stepper.next();
	}

	stepperReset(stepper: MatStepper) {
		stepper.reset();
	}
}
