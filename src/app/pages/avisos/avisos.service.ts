import { Injectable } from '@angular/core';
import { Aviso, Avisos } from 'src/app/models/aviso.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { TipoInmueble } from 'src/app/models/aviso_tipoinmueble.model';
import { Localidad } from 'src/app/models/localidad.model';

@Injectable({
	providedIn: 'root'
})
export class AvisosService {
	
	avisos: Aviso[] = [];
	avisostotal = 1;
	actualPage = 0;

	constructor(
		private http: HttpClient,
		private router: Router,
		private snackBar: MatSnackBar,
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

			if (filtros.localidad.length === 0) 	reject('Seleccione una Localidad.');
			if (filtros.tipooperacion.length === 0) reject('Seleccione un tipo de Operacion.');
			if (filtros.tipoinmueble.length === 0) 	reject('Seleccione un tipo de Inmueble.');
			
			let operaciones: string; // venta-compra-alquiler
			let inmuebles: string;
			let localidades: string;
			
			filtros.tipooperacion.forEach( (operacion: string) => operaciones ? operaciones += '-' + operacion : operaciones = operacion );
			filtros.tipoinmueble.forEach( (inmueble: string) => inmuebles ? inmuebles += '-' + inmueble : inmuebles = inmueble );
			filtros.localidad.forEach( (localidad: string) => localidades ? localidades += '-' + localidad : localidades = localidad);

			const url = `${URL_SERVICIOS}/avisos/${operaciones}/${inmuebles}/${localidades}/0`;

			this.http.get(url).subscribe((data: Avisos) => {
				if (data.ok && data.avisos.length > 0) {
					// si se encuentran avisos se lo paso al servicio de avisos. Si yo entro
					// a la pagina avisos sin pasar por inicio, me va a levantar TODOS los avisos activos.
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
