import { Injectable } from '@angular/core';
import { Aviso, Avisos } from 'src/app/models/aviso.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AvisosService {
	
	avisos: Aviso[];
	avisostotal = 1;
	actualPage = 0;

	constructor(
		private http: HttpClient
	) {
		
		if (localStorage.getItem('filtros')) {
			const filtros = JSON.parse(localStorage.getItem('filtros'));
			this.obtenerAvisos(filtros).then((msg) => {
				console.log(msg);
			});
		}


	}
	// Obtiene avisos según criterios de busqueda (inicio)

	obtenerAvisos(filtros: any) {
		return new Promise((resolve, reject) => {
			// Una vez que ya tengo los objetos JS armo una cadena string con los IDs de las operaciones

			if (filtros.localidad.length === 0) {
				reject('Seleccione una Localidad.');
				this.avisos = [];
				return;
			} 	
			if (filtros.tipooperacion.length === 0)	{ 
				reject('Seleccione un tipo de Operacion.');
				this.avisos = [];
				return;
			}
			if (filtros.tipoinmueble.length === 0) {
				reject('Seleccione un tipo de Inmueble.');
				this.avisos = [];
				return;
			}
			
			let operaciones: string; // venta-compra-alquiler
			let inmuebles: string;
			let localidades: string;
			
			filtros.tipooperacion.forEach( (operacion: string) => operaciones ? operaciones += '-' + operacion : operaciones = operacion );
			filtros.tipoinmueble.forEach( (inmueble: string) => inmuebles ? inmuebles += '-' + inmueble : inmuebles = inmueble );
			filtros.localidad.forEach( (localidad: string) => localidades ? localidades += '-' + localidad : localidades = localidad);


			if ((operaciones === 'undefined') || (inmuebles === 'undefined') || (localidades === 'undefined')) 	reject('Flatan datos por favor verifique.');

			const url = `${URL_SERVICIOS}/avisos/${operaciones}/${inmuebles}/${localidades}/0`;
			console.log(url);
			this.http.get(url)
	
			.subscribe((data: Avisos) => {
				if (data.ok && data.avisos.length > 0) {
					// si se encuentran avisos se lo paso al servicio de avisos. Si yo entro
					// a la pagina avisos sin pasar por inicio, me va a levantar TODOS los avisos activos.
					console.log(data);
					
					this.avisos = data.avisos;
					resolve(`Se obtuvieron ${data.avisos.length} avisos`);
				} else {
					this.avisos = [];
					reject('No se obtuvieron resultados.');
				}
			},
				(err) => {
					this.avisos = [];
					reject(err);
				}
			);


		});
	}
}
