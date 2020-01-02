import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { FormGroup } from '@angular/forms';
import { Propiedades, Propiedad } from 'src/app/models/propiedad.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PropiedadesService } from '../propiedades/propiedades.service';

@Injectable({
  providedIn: 'root'
})
export class InicioService {
  propiedades: Propiedad[] = [];
  constructor(
	private http: HttpClient,
	private router: Router,
	private snackBar: MatSnackBar,
	private propiedadesService: PropiedadesService
  ) { }

  obtenerOperaciones() {
	const url = URL_SERVICIOS + '/inicio/operaciones';
	return this.http.get(url);
  }

  obtenerInmuebles() {
	const url = URL_SERVICIOS + '/inicio/inmuebles';
	return this.http.get(url);
  }

  buscarLocalidad(event) {
	const url = URL_SERVICIOS + '/buscar/localidades/' + event;
	return this.http.get(url);
  }

  buscarPropiedades(formulario: FormGroup) {
	const tipooperacion = formulario.value.tipooperacion.id;
	const tipoinmueble = formulario.value.tipoinmueble.id;
	const localidad = formulario.value.localidad.id;

	const url = `${URL_SERVICIOS}/inicio/propiedades/${tipooperacion}/${tipoinmueble}/${localidad}/0`;

	this.http.get(url).subscribe((data: Propiedades) => {

		if (data.ok && data.propiedades.length > 0) {
		// si se encuentran resultados se lo paso al servicio de los resultados. Si yo entro
		// a la pagina resultados sin pasar por inicio, me va a levantar TODAS las propiedades activas.
		this.propiedadesService.propiedades = data.propiedades;
		this.router.navigate(['/resultados']);
		} else {
		this.snackBar.open('No se encontraron resultados.', 'Aceptar', {
			duration: 5000,
		});
		}

	});
  }

}
