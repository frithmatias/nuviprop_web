import { Injectable } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inmobiliaria } from 'src/app/models/inmobiliaria.model';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class InmobiliariaService {
	totalInmobiliarias = 0;
	constructor(
		private usuarioService: UsuarioService,
		private http: HttpClient
	) { }

	obtenerInmobiliarias() {
		const url = URL_SERVICIOS + '/inmobiliarias';
		return this.http.get(url).pipe(
			map((resp: any) => {
				this.totalInmobiliarias = resp.total;
				return resp.inmobiliarias;
			})
		);
	}

	obtenerInmobiliaria(id: string) {
		const url = URL_SERVICIOS + '/inmobiliarias/' + id;
		return this.http.get(url).pipe(map((resp: any) => resp.inmobiliaria));
	}

	buscarInmobiliaria(termino: string) {
		const url = URL_SERVICIOS + '/buscar/inmobiliarias/' + termino;
		return this.http.get(url).pipe(map((resp: any) => resp.inmobiliarias));
	}

	crearInmobiliaria(nombre: string) {
		const url = URL_SERVICIOS + '/inmobiliarias/';
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});
		return this.http.post(url, { nombre }, { headers }).pipe(
			map((resp: any) => {
				//        return resp.hospital;
			})
		);
	}

	actualizarInmobiliaria(inmobiliaria: Inmobiliaria) {
		const url = URL_SERVICIOS + '/inmobiliarias/' + inmobiliaria._id;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});
		return this.http.put(url, inmobiliaria, { headers }).pipe(
			map((resp: any) => {
				return resp.hospital;
			})
		);
	}

	borrarInmobiliaria(id: string) {
		const url = URL_SERVICIOS + '/inmobiliarias/' + id;
		const headers = new HttpHeaders({
			'x-token': this.usuarioService.token
		});

		return this.http.delete(url, { headers });
	}
}
