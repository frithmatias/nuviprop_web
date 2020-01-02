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

	constructor(private http: HttpClient) {


		// this.obtenerFormulario('formPropiedad').subscribe((data: respForm) => {
		//   this.forms.push(data.form[0]);
		//   console.log(data);
		// });
		this.getDataControls();

	}



	getDataControls() {
		this.obtenerOperaciones().subscribe((data: TiposOperaciones) => {
			this.tiposOperaciones = data.operaciones;
			console.log(data.operaciones);
		})
		this.obtenerInmuebles().subscribe((data: TiposInmuebles) => {
			this.tiposInmuebles = data.inmuebles;
			console.log(data.inmuebles);
		})
		this.obtenerProvincias().subscribe((data: RespProvincias) => {
			this.provincias = data.provincias;
			console.log(data.provincias);
		})
	}

	obtenerOperaciones() {
		const url = URL_SERVICIOS + '/inicio/operaciones';
		return this.http.get(url);
	}

	obtenerInmuebles() {
		const url = URL_SERVICIOS + '/inicio/inmuebles';
		return this.http.get(url);
	}

	obtenerUnidades(idparent: string) {
		const url = URL_SERVICIOS + '/inicio/unidades/' + idparent;
		return this.http.get(url);
	}

	obtenerProvincias() {
		const url = URL_SERVICIOS + '/inicio/provincias';
		return this.http.get(url);
	}

	buscarLocalidad(event) {
		const url = URL_SERVICIOS + '/buscar/localidades/' + event;
		return this.http.get(url);
	}


}
