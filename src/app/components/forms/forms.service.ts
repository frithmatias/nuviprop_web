import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { TiposOperaciones, TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { TipoInmueble, TiposInmuebles } from 'src/app/models/aviso_tipoinmueble.model';
import { RespProvincias, Provincia } from 'src/app/models/aviso_provincia.model';
import { FormControl } from '@angular/forms';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

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

	// Control Autocomplete
	nombreLocalidad: string = '';
	// declaro mi nuevo control donde voy a capturar los datos ingresados para la busqueda.
	localidadesControl = new FormControl();
	// en localidades guardo la lista de localidades en el AUTOCOMPLETE
	localidades: any[] = [];


	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
		private capitalizarPipe: CapitalizarPipe,
	) {
		this.getGlobalControls();
		this.localidadesControl.valueChanges.subscribe(data => {
			if (typeof data !== 'string' || data.length <= 0) {
				return;
			}
			const filterValue = data.toLowerCase();
			if (data.length === 3) {
				this.buscarLocalidad(filterValue).then((resp: Localidades) => {
					resp.localidades.forEach(localidad => {
						this.localidades.push(localidad);
					});
				});
			} else if (data.length > 3) {
				this.localidades = this.localidades.filter((localidad: Localidad) => {
					return localidad.properties.nombre.toLowerCase().includes(filterValue);
				});
			}
		});
	}

	// METODOS DEL CONTROL LOCALIDAD 
	buscarLocalidad(pattern) {
		return new Promise((resolve, reject) => {
			const regex = new RegExp(/^[a-z ñ0-9]+$/i);
			if (!regex.test(pattern) && pattern) {
				this.snackBar.open('¡Ingrese sólo caracteres alfanuméricos!', 'Aceptar', {
					duration: 2000,
				});
				reject();
				return;
			}

			this.localidades = [];
			// Con el fin de evitar sobrecargar al server con peticiones de datos duplicados, le pido al backend
			// que me envíe resultados SOLO cuando ingreso tres caracteres, a partir de esos resultados
			// el filtro lo hace el cliente en el frontend con los datos ya almacenados en this.localidades.

			this.obtenerLocalidad(pattern).subscribe((resp: Localidades) => {
				if (resp.ok) {
					resp.localidades.forEach(localidad => {
						localidad.properties.nombre = this.capitalizarPipe.transform(localidad.properties.nombre);
					})
					resolve(resp);
					return resp;
				}
			});
		});


	}

	cleanInput() {
		this.nombreLocalidad = '';
		this.localidadesControl.reset();
		this.localidades = [];
	}

	setLocalidad(localidad) {

		this.nombreLocalidad = this.localidadesControl.value.properties.nombre + ', ' + this.localidadesControl.value.properties.departamento.nombre + ', ' + this.localidadesControl.value.properties.provincia.nombre;
		let localidadObj = {
			_id: localidad._id,
			nombre: localidad.properties.nombre,
			id: localidad.properties.nombre.toLowerCase().replace(/ /g, '_')
		}
		let storage = {};
		storage = JSON.parse(localStorage.getItem('filtros')) || {};
		storage['localidad'] = [];
		storage['localidad'].push(JSON.stringify(localidadObj));
		localStorage.setItem('filtros', JSON.stringify(storage));
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
		//http://localhost:3000/inicio/unidades/tipoinmueble_departamento
		const url = URL_SERVICIOS + '/inicio/unidades/' + idparent;
		return this.http.get(url);
	}

	// Busca localidades según patrón (inicio y aviso-crear)
	obtenerLocalidad(event) {
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






}
