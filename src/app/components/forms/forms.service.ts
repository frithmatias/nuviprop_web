import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { TiposOperaciones, TipoOperacion } from 'src/app/models/tipos_operacion.model';
import { TipoInmueble, TiposInmuebles } from 'src/app/models/tipos_inmueble.model';
import { RespProvincias, Provincia } from 'src/app/models/tipos_provincia.model';
import { FormGroup } from '@angular/forms';
import { Propiedades } from 'src/app/models/propiedad.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PropiedadesService } from 'src/app/pages/propiedades/propiedades.service';

@Injectable({
	providedIn: 'root'
})
export class FormsService {
	tiposOperaciones: TipoOperacion[] = [];
	tiposInmuebles: TipoInmueble[] = [];
	provincias: Provincia[] = [];
	loading = {
		tipooperacion: false,
		tipoinmueble: false,
		provincias: false
	};

	constructor(
		private http: HttpClient,
		private router: Router,
		private snackBar: MatSnackBar,
		private propiedadesService: PropiedadesService
	) {

		this.getGlobalControls();

	}


	// Este metodo invoca todos los metodos de scope global y lo inicializa el servicio de formularios
	getGlobalControls() {
		this.obtenerOperaciones().subscribe((data: TiposOperaciones) => {
			if (data.ok) this.loading.tipooperacion = true;
			this.tiposOperaciones = data.operaciones;
		})
		this.obtenerInmuebles().subscribe((data: TiposInmuebles) => {
			if (data.ok) this.loading.tipoinmueble = true;
			this.tiposInmuebles = data.inmuebles;
		})
		this.obtenerProvincias().subscribe((data: RespProvincias) => {
			if (data.ok) this.loading.provincias = true;
			this.provincias = data.provincias;
		})
	}

	// Obtiene los tipos de operaciones (scope global)
	obtenerOperaciones() {
		const url = URL_SERVICIOS + '/inicio/operaciones';
		return this.http.get(url);
	}

	// Obtiene los tipos de inmuebles (scope global)
	obtenerInmuebles() {
		const url = URL_SERVICIOS + '/inicio/inmuebles';
		return this.http.get(url);
	}

	// Obtiene todas las provincias (scope global)
	obtenerProvincias() {
		const url = URL_SERVICIOS + '/inicio/provincias';
		return this.http.get(url);
	}

	// Obtiene unidades según tipo de inmueble (solo departamentos y casas)
	obtenerUnidades(idparent: string) {
		const url = URL_SERVICIOS + '/inicio/unidades/' + idparent;
		return this.http.get(url);
	}

	// Busca localidades según patrón (inicio y propiedad-crear)
	buscarLocalidad(event) {
		// le paso un patter con tres caracteres y me devuelve las localidades coincidentes.
		const url = URL_SERVICIOS + '/buscar/localidades/' + event;
		return this.http.get(url);
	}

	// Obtiene todas las localidades vecinas a una localidad dada (filtros)
	obtenerLocalidadesEnDepartamento(idLocalidad: string) {
		// en los filtros necesito mostrar las localidades vecinas a las que estoy buscando 
		// para ofrecerlas como opción de busqueda.
		const url = URL_SERVICIOS + '/inicio/localidadesendepartamento/' + idLocalidad;
		return this.http.get(url);
	}

	// Obtiene propiedades según criterios de busqueda (inicio)
	obtenerPropiedades() {



		// CONSTRUYO EL MODELO DEL QUERY
		// El modelo del query es cada filtro separado por guión - y cada tipo de filtro 
		// separado por slash / 
		// localhost:3000/inicio/propiedades/alquiler-venta/ph-casa-departamento/

		let filtros = JSON.parse(localStorage.getItem('filtros'))
		console.log('localStorage: ', filtros);

		const tipooperacion: any[] = filtros.tipooperacion;
		const tipoinmueble: any[] = filtros.tipoinmueble;
		const localidad: any[] = filtros.localidad;

		let operaciones: string;
		let inmuebles: string;
		let localidades: string;


		tipooperacion.forEach(operacion => {
			if (operaciones) {
				operaciones = operaciones + '-' + operacion.id;
			} else {
				operaciones = operacion.id;

			}
		})

		tipoinmueble.forEach(inmueble => {
			if (inmuebles) {
				inmuebles = inmuebles + '-' + inmueble.id;
			} else {
				inmuebles = inmueble.id;

			}
		})

		localidad.forEach(localidad => {
			let nombre = localidad.properties.nombre.toLowerCase().replace(/ /g, '_');
			if (localidades) {
				localidades = localidades + '-' + nombre;
			} else {
				localidades = nombre;
			}
		})

		console.log(operaciones);
		console.log(inmuebles);
		console.log(localidades);

		const url = `${URL_SERVICIOS}/inicio/propiedades/${operaciones}/${inmuebles}/${localidades}/0`;
		console.log('TRAYENDO PROPIEDADES:', url);



		// el formato de los filtros en la localstorage es un gran objeto de arrays de objetos
		// cada array representa un filtro, y cada objeto dentro del array representa un check 
		// por lo tanto tengo que enviar los datos de busqueda con el formato que va a entender 
		// el componente Propiedades.




		this.http.get(url).subscribe((data: Propiedades) => {

			if (data.ok && data.propiedades.length > 0) {
				// si se encuentran propiedades se lo paso al servicio de propiedades. Si yo entro
				// a la pagina propiedades sin pasar por inicio, me va a levantar TODAS las propiedades activas.
				this.propiedadesService.propiedades = data.propiedades;
				this.router.navigate(['/propiedades']);
			} else {
				this.snackBar.open('No se encontraron resultados.', 'Aceptar', {
					duration: 5000,
				});
			}

		});
	}
}
