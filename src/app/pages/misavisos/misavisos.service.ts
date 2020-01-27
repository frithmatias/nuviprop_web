import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuarios.service';
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

	cargarMisFavoritos(pagina: number) {
		const arrAvisos: string = this.usuarioService.usuario.favoritos.toString();
		let url = URL_SERVICIOS;
		url += '/avisos/misfavoritos/?pagina=' + pagina + '&avisos=' + arrAvisos;
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

	// guardar = crear o actualizar
	guardarAviso(dataform: any, avisoId: string) {
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




	cambiarEstado(id: string) {
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
	// al momento de guardar los detalles, yo se que tengo una aviso guardada (this.aviso)
	// por lo tanto puedo pasarle el objeto como argumento donde tengo toda la data.
	// NO puedo hacer lo mismo con guardarAviso porque puede ser un fromulario en blanco
	// en ese caso sólo puedo saber si se trata de una aviso NUEVA obteniendo los parametros
	// de la url con activatedRoute obteniendo params.id que me trae 'nuevo' o el id de la aviso.
	guardarDetalles(dataform: any, aviso: Aviso) {
		let url = URL_SERVICIOS;
		console.log(aviso);
		console.log(dataform);
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
