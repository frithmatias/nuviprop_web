import { Injectable } from '@angular/core';
import { Propiedad, Propiedades } from 'src/app/models/propiedad.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class PropiedadesService {

	propiedades: Propiedad[] = [];
	propiedadestotal = 1;
	actualPage = 0;

	filtrosOperaciones: any[] = [];
	filtrosInmuebles: any[] = [];
	filtrosLocalidades: any[] = [];

	constructor(
		private http: HttpClient,
		private router: Router,
		private snackBar: MatSnackBar,
	) {
		// this.cargarPropiedades(0);
		this.obtenerPropiedades();
	}
	// Obtiene propiedades según criterios de busqueda (inicio)

	obtenerPropiedades() {
		if (!localStorage.getItem('filtros')) {
			return;
		}
		let filtros = JSON.parse(localStorage.getItem('filtros'))
		console.log('localStorage: ', filtros);
		this.filtrosOperaciones = [];
		this.filtrosInmuebles = [];
		this.filtrosLocalidades = [];
		filtros.tipooperacion.forEach(operacion => {
			this.filtrosOperaciones.push(JSON.parse(operacion));
		})
		filtros.tipoinmueble.forEach(inmueble => {
			this.filtrosInmuebles.push(JSON.parse(inmueble));
		})
		filtros.localidad.forEach(localidad => {
			this.filtrosLocalidades.push(JSON.parse(localidad));
		})




		let operaciones: string;
		let inmuebles: string;
		let localidades: string;
		this.filtrosOperaciones.forEach(operacion => {
			if (operaciones) {
				operaciones = operaciones + '-' + operacion.id;
			} else {
				operaciones = operacion.id;

			}
		})

		this.filtrosInmuebles.forEach(inmueble => {
			if (inmuebles) {
				inmuebles = inmuebles + '-' + inmueble.id;
			} else {
				inmuebles = inmueble.id;

			}
		})

		this.filtrosLocalidades.forEach(localidad => {
			if (localidades) {
				localidades = localidades + '-' + localidad.id;
			} else {
				localidades = localidad.id;
			}
		})
		const url = `${URL_SERVICIOS}/inicio/propiedades/${operaciones}/${inmuebles}/${localidades}/0`;
		this.http.get(url).subscribe((data: Propiedades) => {
			if (data.ok && data.propiedades.length > 0) {
				// si se encuentran propiedades se lo paso al servicio de propiedades. Si yo entro
				// a la pagina propiedades sin pasar por inicio, me va a levantar TODAS las propiedades activas.
				this.propiedades = data.propiedades;
				// console.log('DATA: ', data)
				this.router.navigate(['/propiedades']);
			} else {
				this.propiedades = [];
				this.snackBar.open('No se encontraron resultados.', 'Aceptar', {
					duration: 1000,
				});
			}
		},
			(err) => {
				this.propiedades = [];
			}
		);
	}
	// cargarPropiedades(pagina: number) {
	// 	// Sola trae las proiedades activas.
	// 	if (this.actualPage * 20 < this.propiedadestotal) { // solo traigo mas, si quedan mas para mostrar.
	// 		let url = URL_SERVICIOS;
	// 		url += '/propiedades';
	// 		url += '?pagina=' + pagina;
	// 		this.http.get(url).subscribe((data: Propiedades) => {
	// 			this.propiedades = data.propiedades;
	// 			this.propiedadestotal = data.total;
	// 		});
	// 	}
	// 	this.actualPage++;
	// }
}
