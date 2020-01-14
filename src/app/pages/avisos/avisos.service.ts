import { Injectable } from '@angular/core';
import { Aviso, Avisos } from 'src/app/models/aviso.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class AvisosService {

	avisos: Aviso[] = [];
	avisostotal = 1;
	actualPage = 0;

	filtrosOperaciones: any[] = [];
	filtrosInmuebles: any[] = [];
	filtrosLocalidades: any[] = [];

	constructor(
		private http: HttpClient,
		private router: Router,
		private snackBar: MatSnackBar,
	) {
		// this.cargarAvisos(0);
		this.obtenerAvisos();
	}
	// Obtiene avisos según criterios de busqueda (inicio)

	obtenerAvisos() {
		if (!localStorage.getItem('filtros')) {
			return;
		}


		let filtros = JSON.parse(localStorage.getItem('filtros'))
		// console.log('localStorage: ', filtros);

		// Obtengo los objetos stringificados de las operaciones en la localstorage
		this.filtrosOperaciones = [];
		filtros.tipooperacion.forEach(operacion => {
			this.filtrosOperaciones.push(JSON.parse(operacion));
		})
		// Una vez que ya tengo los objetos JS armo una cadena string con los IDs de las operaciones 
		let operaciones: string; // venta-compra-alquiler
		this.filtrosOperaciones.forEach(operacion => {
			if (operaciones) {
				operaciones = operaciones + '-' + operacion.id;
			} else {
				operaciones = operacion.id;
			}
		})

		// INMUEBLES
		this.filtrosInmuebles = [];
		filtros.tipoinmueble.forEach(inmueble => {
			this.filtrosInmuebles.push(JSON.parse(inmueble));
		})
		let inmuebles: string;
		this.filtrosInmuebles.forEach(inmueble => {
			if (inmuebles) {
				inmuebles = inmuebles + '-' + inmueble.id;
			} else {
				inmuebles = inmueble.id;

			}
		})

		// LOCALIDADES
		this.filtrosLocalidades = [];
		filtros.localidad.forEach(localidad => {
			this.filtrosLocalidades.push(JSON.parse(localidad));
		})
		let localidades: string;
		this.filtrosLocalidades.forEach(localidad => {
			if (localidades) {
				localidades = localidades + '-' + localidad.id;
			} else {
				localidades = localidad.id;
			}
		})

		const url = `${URL_SERVICIOS}/inicio/avisos/${operaciones}/${inmuebles}/${localidades}/0`;
		this.http.get(url).subscribe((data: Avisos) => {
			if (data.ok && data.avisos.length > 0) {
				// si se encuentran avisos se lo paso al servicio de avisos. Si yo entro
				// a la pagina avisos sin pasar por inicio, me va a levantar TODAS las avisos activas.
				this.avisos = data.avisos;
				// console.log('DATA: ', data)
				this.router.navigate(['/avisos']);
			} else {
				this.avisos = [];
				// this.snackBar.open('No se encontraron resultados.', 'Aceptar', {
				// 	duration: 1000,
				// });
			}
		},
			(err) => {
				this.avisos = [];
			}
		);
	}
	// cargarAvisos(pagina: number) {
	// 	// Sola trae las proiedades activas.
	// 	if (this.actualPage * 20 < this.avisostotal) { // solo traigo mas, si quedan mas para mostrar.
	// 		let url = URL_SERVICIOS;
	// 		url += '/avisos';
	// 		url += '?pagina=' + pagina;
	// 		this.http.get(url).subscribe((data: Avisos) => {
	// 			this.avisos = data.avisos;
	// 			this.avisostotal = data.total;
	// 		});
	// 	}
	// 	this.actualPage++;
	// }
}
