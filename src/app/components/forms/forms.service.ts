import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { TiposOperaciones, TipoOperacion } from 'src/app/models/tipos_operacion.model';
import { TipoInmueble, TiposInmuebles } from 'src/app/models/tipos_inmueble.model';
import { RespProvincias, Provincia } from 'src/app/models/tipos_provincia.model';

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
		private http: HttpClient
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


}
