import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { TiposOperaciones, TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { TipoInmueble, TiposInmuebles } from 'src/app/models/aviso_tipoinmueble.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Control } from 'src/app/models/form.model';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Localidades, Localidad } from 'src/app/models/localidad.model';

@Injectable({
	providedIn: 'root'
})
export class FormsService {

	// GLOBAL CONTROLS DATA ///////////////////
	tiposOperaciones: TipoOperacion[];
	tiposInmuebles: TipoInmueble[];
	tiposCambio: any[];
	localidadesCercanas: any[];
	////////////////////////////////////////////

	loading = {
		tipooperacion: false,
		tipoinmueble: false,
	};

	// declaro mi nuevo control donde voy a capturar los datos ingresados para la busqueda.
	localidadesControl = new FormControl();

	// en localidades guardo la lista de localidades en el AUTOCOMPLETE
	localidades: any[] = [];

	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
		private capitalizarPipe: CapitalizarPipe
	) {
		this.getControlsData();
		this.localidadesControl.valueChanges.subscribe(data => {
			if (typeof data !== 'string' || data.length <= 0) {
				return;
			}
			const filterValue = data.toLowerCase();
			if (data.length === 3) {
				this.buscarLocalidades(filterValue).then((resp: Localidades) => {
					// console.log(resp); // trea localidades vecinas, objetos GEO completos
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

	dataReady(): Observable<boolean> {
		return new Observable(observer => {
			let contador = 0;
			const timer = setInterval(() => {
				contador += 1;
				if (this.tiposOperaciones && this.tiposInmuebles && this.tiposCambio) {
					clearInterval(timer);
					observer.next(true);
					observer.complete();
				}
				observer.next(false);
				//  if(contador === 2){
				// 		clearInterval(timer);
				// 		observer.error('Se recibió un 2');
				//  }
			}, 100);
		});
	}

	async getControlsData() {
		return new Promise(async (resolve, reject) => {
			this.tiposOperaciones = await this.obtenerOperaciones();
			this.tiposInmuebles = await this.obtenerInmuebles();
			this.tiposCambio = await this.obtenerCambios();
			this.tiposOperaciones.unshift({ _id: 'indistinto', nombre: 'Todas las operaciones', id: 'tipooperacion_indistinto' });
			this.tiposInmuebles.unshift({ _id: 'indistinto', nombre: 'Todos los inmuebles', id: 'tipoinmueble_indistinto' });
			resolve();
		});
	}

	obtenerOperaciones(): Promise<TipoOperacion[]> {
		return new Promise((resolve, reject) => {
			const url = URL_SERVICIOS + '/inicio/operaciones';
			return this.http.get(url).subscribe((data: TiposOperaciones) => {
				if (data.ok) {
					this.loading.tipooperacion = true;
					resolve(data.operaciones);
				}
			});
		});
	}

	obtenerInmuebles(): Promise<TipoInmueble[]> {
		return new Promise((resolve, reject) => {
			const url = URL_SERVICIOS + '/inicio/inmuebles';
			return this.http.get(url).subscribe((data: TiposInmuebles) => {
				if (data.ok) {
					this.loading.tipoinmueble = true;
					resolve(data.inmuebles);
				}
			});
		});

	}

	obtenerUnidades(idparent: string) {
		// http://localhost:3000/inicio/unidades/tipoinmueble_departamento
		const url = URL_SERVICIOS + '/inicio/unidades/' + idparent;
		return this.http.get(url);
	}

	obtenerCambios(): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const url = URL_SERVICIOS + '/inicio/cambio';
			return this.http.get(url).subscribe((data: any) => {
				resolve(data.tipocambio);
			});
		});
	}

	buscarLocalidades(pattern) {
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

	cleanInput() {
		this.localidadesControl.reset();
		this.localidades = [];
	}

	obtenerLocalidadesVecinas(localidad: Localidad) {
		return new Promise((resolve, reject) => {
			const url = URL_SERVICIOS + '/inicio/localidadesendepartamento/' + localidad._id;
			return this.http.get(url).subscribe((data: Localidades) => {
				this.localidadesCercanas = data.localidades;
				this.localidadesCercanas.forEach(thislocalidad => {
					const nombreCapitalizado = this.capitalizarPipe.transform(thislocalidad.properties.nombre);
					thislocalidad.nombre = nombreCapitalizado;
				});
				this.localidadesCercanas.unshift({ _id: 'indistinto', nombre: 'Todo ' + data.localidades[0].properties.departamento.nombre, id: 'localidad_indistinto' });
				localStorage.setItem('localidades', JSON.stringify(this.localidadesCercanas));
				resolve(this.localidadesCercanas);
			});
		});

	}

	obtenerLocalidad(event) {
		// le paso un patter con tres caracteres y me devuelve las localidades coincidentes.
		const url = URL_SERVICIOS + '/buscar/localidades/' + event;
		return this.http.get(url);
	}

	createControl(control: Control) {
		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});
		const url = URL_SERVICIOS + `/forms/createcontrol`;

		return this.http.post(url, control, { headers })
			.pipe(
				map((data: any) => data),
				catchError((err) => {
					return throwError(err); // Devuelve un error al suscriptor de mi observable.
				})
			);
	}

	obtenerFormControls(tipooperacion?: string, tipoinmueble?: string) {
		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});
		const url = URL_SERVICIOS + `/forms/getcontrols/${tipooperacion}/${tipoinmueble}`;

		return this.http.get(url, { headers })
			.pipe(
				map((data: any) => data.form[0]),
				catchError((err) => {
					return throwError(err); // Devuelve un error al suscriptor de mi observable.
				})
			);

	}

	obtenerFormControlsAndData(tipooperacion?: string, tipoinmueble?: string) {
		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});
		const url = URL_SERVICIOS + `/forms/getcontrolsdata/${tipooperacion}/${tipoinmueble}`;

		return this.http.get(url, { headers })
			.pipe(
				// map((data: any) => data),
				catchError((err) => {
					return throwError(err); // Devuelve un error al suscriptor de mi observable.
				})
			);

	}

	getAllControls() {
		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});
		const url = URL_SERVICIOS + `/forms/getallcontrols`; // TODoS los controles (forms-admin)

		return this.http.get(url, { headers }).pipe(
			map((data: any) => data),
			catchError((err) => {
				return throwError(err.error.mensaje); // Devuelve un error al suscriptor de mi observable.
			})
		);

	}

	setFormControls(controls: any) {
		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});
		const url = URL_SERVICIOS + `/forms/setformcontrols`;
		return this.http.put(url, controls, { headers });
	}
}
