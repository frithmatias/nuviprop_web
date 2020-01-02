import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuarios.service';
import { Propiedades, Propiedad } from 'src/app/models/propiedad.model';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { MatStepper } from '@angular/material/stepper';
import { Detalles } from 'src/app/models/detalle.model';

@Injectable({
  providedIn: 'root'
})
export class MisPropiedadesService {


  constructor(
	private http: HttpClient,
	private usuarioService: UsuarioService
  ) { }


  obtenerFormularios(formname: string) {
	const url = URL_SERVICIOS + '/form/' + formname;
	return this.http.get(url);
  }

  cargarPropiedades(get: string, pagina: number) {
	let url = URL_SERVICIOS;
	switch (get) {
		case 'activas':
		url += '/propiedades';
		break;
		case 'todas':
		url += '/propiedades/all';
		break;
		default:
		url += '/propiedades';
		break;
	}
	url += '?pagina=' + pagina;
	const headers = new HttpHeaders({
		'x-token': this.usuarioService.token
	});
	return this.http.get(url, { headers }).pipe(map((propiedades: Propiedades) => {
		return propiedades;
	}));
  }

  obtenerPropiedad(id: string) {
	const url = URL_SERVICIOS + '/propiedades/' + id;
	return this.http.get(url).pipe(
		map((resp: any) => {
		return resp.propiedad;
		})
	);
  }

  buscarPropiedad(termino: string) {
	const url = URL_SERVICIOS + '/buscar/propiedades/' + termino;
	return this.http.get(url);
  }

  // guardar = crear o actualizar
  guardarPropiedad(dataform: any, propId: string) {
	let url = URL_SERVICIOS;
	url += '/propiedades';
	// url += '/propiedades/detalles';
	const headers = new HttpHeaders({
		'x-token': this.usuarioService.token
	});

	if (propId !== 'nuevo') {
		// actualizando
		url += '/' + propId;
		return this.http.put(url, dataform, { headers }).pipe(
		map((resp: any) => {
			Swal.fire({
			title: '¡Propiedad actualizada!',
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
			title: '¡Propiedad creada!',
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
	url += '/propiedades/pause/' + id;
	const headers = new HttpHeaders({
		'x-token': this.usuarioService.token
	});
	return this.http.put(url, {}, { headers }).pipe(
		map((resp: any) => {
		if (resp.propiedad.activo) {
			Swal.fire({
			title: '¡Propiedad activada!',
			icon: 'success',
			timer: 1000
			});
		} else {
			Swal.fire({
			title: '¡Propiedad desactivada!',
			icon: 'success',
			timer: 1000
			});
		}
		return resp.propiedad;
		})
	);
  }
  // al momento de guardar los detalles, yo se que tengo una propiedad guardada (this.propiedad)
  // por lo tanto puedo pasarle el objeto como argumento donde tengo toda la data.
  // NO puedo hacer lo mismo con guardarPropiedad porque puede ser un fromulario en blanco
  // en ese caso sólo puedo saber si se trata de una propiedad NUEVA obteniendo los parametros
  // de la url con activatedRoute obteniendo params.id que me trae 'nuevo' o el id de la propiedad.
  guardarDetalles(dataform: any, propiedad: Propiedad) {
	let url = URL_SERVICIOS;

	url += '/propiedades/detalles/' + propiedad._id;
	const headers = new HttpHeaders({
		'x-token': this.usuarioService.token
	});

	if (propiedad.detalles) {
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

  stepperGoBack(stepper: MatStepper) {
	stepper.previous();
  }

  stepperGoNext(stepper: MatStepper) {
	this.scrollTop();
	stepper.next();
  }
}
