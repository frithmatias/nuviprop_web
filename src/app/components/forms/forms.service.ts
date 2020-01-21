import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { TiposOperaciones, TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { TipoInmueble, TiposInmuebles } from 'src/app/models/aviso_tipoinmueble.model';
import { FormControl } from '@angular/forms';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class FormsService {

	tiposOperaciones: TipoOperacion[] = [];
	tiposInmuebles: TipoInmueble[] = [];
	localidadesCercanas: any[] = [];

	loading = {
		tipooperacion: false,
		tipoinmueble: false,
	};

	// Control Autocomplete
	nombreLocalidad = '';
	// declaro mi nuevo control donde voy a capturar los datos ingresados para la busqueda.
	localidadesControl = new FormControl();
	// en localidades guardo la lista de localidades en el AUTOCOMPLETE
	localidades: any[] = [];


	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
		private capitalizarPipe: CapitalizarPipe,
	) {
		this.fillControlsData();
		this.getUltimasLocalidades();
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
					});
					resolve(resp);
					return resp;
				}
			});
		});


	}

	getUltimasLocalidades() {
		// LOCALIDADES (OBJETOS CON DATOS DE LOCALIDADES CERCANAS)
		// Los filtros se componen de datos seleccionados de un conjuto ya definido de datos como las operaciones
		// En el caso de las localidades, tengo que guardar las localidades cercanas para poder mostrarlas al
		// recargar la página.
		this.localidadesCercanas = JSON.parse(localStorage.getItem('localidades'));
	}

	cleanInput() {
		this.nombreLocalidad = '';
		this.localidadesControl.reset();
		this.localidades = [];
	}

	setLocalidad(localidad: Localidad) {
		// setLocalidad() es un metodo que se encuentra en los componentes INICIO y AVISO, se llama localmente y luego
		// se llama al metodo setLocalidad() en el servicio formsService, que setea globalmente el nombre compuesto de
		// la localidad seleccionada, y luego busca localidades cercanas. En el componente de FILTROS no se necesita
		// invocar a este metodo localmente, porque NO NECESITA setear el _id para submitirlo, como SI es necesario en
		// INICIO (push) y AVISO (patchValue) porque se trata de componenentes en un formulario. El componente FILTROS
		// SOLO necesita setear en lombre compuesto, y luego buscar localidades cercanas.
		this.nombreLocalidad = localidad.properties.nombre + ', ' + localidad.properties.departamento.nombre + ', ' + localidad.properties.provincia.nombre;
		this.localidadesVecinas(localidad);
	}

	localidadesVecinas(localidad: Localidad) {
		this.obtenerLocalidadesVecinas(localidad._id).subscribe((data: Localidades) => {
			this.localidadesCercanas = [];
			data.localidades.forEach(localidad => {
				const nombreCapitalizado = this.capitalizarPipe.transform(localidad.properties.nombre);
				const localidadVecina = {
					_id: localidad._id,
					nombre: nombreCapitalizado,
					id: nombreCapitalizado.toLowerCase().replace(/ /g, '_')
				};
				this.localidadesCercanas.unshift(localidadVecina);

			});
			localStorage.setItem('localidades', JSON.stringify(this.localidadesCercanas));
		});
	}

	// Obtiene todas las localidades vecinas a una localidad dada (filtros)
	obtenerLocalidadesVecinas(idLocalidad: string) {
		// en los filtros necesito mostrar las localidades vecinas a las que estoy buscando
		// para ofrecerlas como opción de busqueda.
		const url = URL_SERVICIOS + '/inicio/localidadesendepartamento/' + idLocalidad;
		return this.http.get(url);
	}

	// Este metodo invoca todos los metodos de scope global y lo inicializa el servicio de formularios
	fillControlsData() {
		this.obtenerOperaciones();
		this.obtenerInmuebles();
	}

	// Obtiene los tipos de operaciones (scope global)
	obtenerOperaciones() {
		const url = URL_SERVICIOS + '/inicio/operaciones';
		return this.http.get(url).subscribe((data: TiposOperaciones) => {
			if (data.ok) { this.loading.tipooperacion = true; }
			this.tiposOperaciones = data.operaciones;
		});
	}

	// Obtiene los tipos de inmuebles (scope global)
	obtenerInmuebles() {
		const url = URL_SERVICIOS + '/inicio/inmuebles';
		return this.http.get(url).subscribe((data: TiposInmuebles) => {
			if (data.ok) { this.loading.tipoinmueble = true; }
			this.tiposInmuebles = data.inmuebles;
		});
	}

	// Obtiene unidades según tipo de inmueble (solo departamentos y casas)
	obtenerUnidades(idparent: string) {
		// http://localhost:3000/inicio/unidades/tipoinmueble_departamento
		const url = URL_SERVICIOS + '/inicio/unidades/' + idparent;
		return this.http.get(url);
	}

	// Busca localidades según patrón (inicio y aviso-crear)
	obtenerLocalidad(event) {
		// le paso un patter con tres caracteres y me devuelve las localidades coincidentes.
		const url = URL_SERVICIOS + '/buscar/localidades/' + event;
		return this.http.get(url);
	}








}
