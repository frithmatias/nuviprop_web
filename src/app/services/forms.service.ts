import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS, CURRENCYLAYER_ENDPOINT } from 'src/app/config/config';
// Models
import {
	TiposOperaciones,
	TipoOperacion,
	TipoInmueble,
	TiposInmuebles
} from 'src/app/models/aviso.model';

import { FormControl } from '@angular/forms';
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
	public valorDolar = 62; // TODO: buscar endpoint para currency, CURRENCYLAYER_ENDPOINT no soporta https

	// GLOBAL CONTROLS DATA ///////////////////
	tiposOperaciones: TipoOperacion[];
	tiposInmuebles: TipoInmueble[];
	tiposCambio: any[];
	localidadesCercanas: any[];
	////////////////////////////////////////////

	dataReady = {
		tipooperacion: false,
		tipoinmueble: false,
		habitaciones: false
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
		console.log('Servicio de formularios cargado.')
		this.obtenerControlesData();
		this.localidadesControl.valueChanges.subscribe(data => {
			if (typeof data !== 'string' || data.length <= 0) {
				return;
			}
			const filterValue = data.toLowerCase();
			if (data.length === 3) {
				this.buscarLocalidades(filterValue).then((resp: Localidades) => {
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
	// busca localidades según pattern al iniciar el servicio
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
			const url = URL_SERVICIOS + '/buscar/localidades/' + pattern;
			this.http.get(url).subscribe((resp: Localidades) => {
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
	// espera para obtener la data de localidades, tipooperacion, tipoinmueble en inicio/filtros
	waitData(): Observable<object> {
		return new Observable(observer => {
			let contador = 0;
			const timer = setInterval(() => {
				contador += 1;
				if (this.tiposOperaciones && this.tiposInmuebles && this.tiposCambio) {
					clearInterval(timer);
					observer.next({ ok: true, contador });
					observer.complete();
				} else {
					observer.next({ ok: false, contador });
				}
				if (contador === 10) {

					this.obtenerControlesData();
					contador = 0;
					// observer.error('Se recibió un 2');
				}
			}, 1000);
		});
	}
	// obtiene la data tipooperaciones/tipoinmuebles/tipocambios
	obtenerControlesData() {
		this.obtenerOperaciones().catch(err => console.log(err.message));
		this.obtenerInmuebles().catch(err => console.log(err.message));
		this.obtenerCambios().catch(err => console.log(err.message));
		// this.obtenerCurrency(); // el endpoint de currencylayer no soporta peticiones get sobre https
	}
	// obtiene cotización del dólar
	obtenerCurrency() {
		return new Promise((resolve, reject) => {
			const currencyEndPoint = CURRENCYLAYER_ENDPOINT;
			return this.http.get(currencyEndPoint)
				.pipe(catchError((err) => throwError(err)))
				.subscribe((data: any) => {
					console.log('Valor del dólar:', data.quotes.USDARS);
					this.valorDolar = data.quotes.USDARS;
					resolve(data.tipocambio);
				});
		});
	}
	// obtiene los tipos de operaciones
	obtenerOperaciones(): Promise<TipoOperacion[]> {
		return new Promise((resolve, reject) => {
			const url = URL_SERVICIOS + '/inicio/operaciones';
			this.http.get(url)
				.pipe(catchError((err) => throwError(err)))
				.subscribe(
					(data: TiposOperaciones) => {
						if (data.ok) {
							this.dataReady.tipooperacion = true;
							this.tiposOperaciones = data.operaciones;
							this.tiposOperaciones.unshift({ _id: 'indistinto', nombre: 'Todas las operaciones', id: 'tipooperacion_indistinto' });
							resolve(data.operaciones);
						}
					},
					(err) => {
						reject(err);
					});
		});

	}
	// obtiene los tipos de inmuebles
	obtenerInmuebles(): Promise<TipoInmueble[]> {
		return new Promise((resolve) => {
			const url = URL_SERVICIOS + '/inicio/inmuebles';
			this.http.get(url)
				.pipe(catchError((err) => throwError(err)))
				.subscribe(
					(data: TiposInmuebles) => {
						if (data.ok) {
							this.dataReady.tipoinmueble = true;
							this.tiposInmuebles = data.inmuebles;
							this.tiposInmuebles.unshift({ _id: 'indistinto', nombre: 'Todos los inmuebles', id: 'tipoinmueble_indistinto' });
							resolve(data.inmuebles);
						}
					},
					(err) => {
						return err;
					});
		});
	}
	// obtiene los tipos de unidades segun un tipo de inmueble dado
	obtenerUnidades(idparent: string) {
		// http://localhost:3000/inicio/unidades/tipoinmueble_departamento
		const url = URL_SERVICIOS + '/inicio/unidades/' + idparent;
		return this.http.get(url);
	}
	// obtiene los tipos de cambio
	obtenerCambios(): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const url = URL_SERVICIOS + '/inicio/cambio';
			return this.http.get(url)
				.pipe(catchError((err) => throwError(err)))
				.subscribe((data: any) => {
					this.tiposCambio = data.tipocambio;
					resolve(data.tipocambio);
				});
		});
	}
	// busca en el header (DESUSO) se reemplazo en componentes avisos>cards/list por el metodo avisosService.buscarAviso(termino)
	buscar(termino: string) {
		const url = URL_SERVICIOS + '/buscar/' + termino;
		return this.http.get(url);
	}
	// limpia control input localidad en inicio/filtros/aviso-crear
	cleanInput() {
		this.localidadesControl.reset();
		this.localidades = [];
	}
	// obtiene localidades en departamento para una localidad dada
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
	// crea un control nuevo para admin>formularios
	crearControl(control: Control, controlId?: string) {

		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});

		let url = URL_SERVICIOS;
		controlId ? url += `/forms/editcontrol/` + controlId : url += `/forms/createcontrol`;

		return this.http.post(url, control, { headers })
			.pipe(
				map((data: any) => data),
				catchError((err) => {
					return throwError(err); // Devuelve un error al suscriptor de mi observable.
				})
			);
	}
	// obtiene los controles asignados segun tipooperacion y tipoinmueble para admin>formularios
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
	// obtiene todos los controles para admin>formularios
	obtenerControlesTodos() {
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
	// obtiene los controles y sus opciones para aviso-crear>detalles
	obtenerFormControlsAndOptions(tipooperacion?: string, tipoinmueble?: string) {
		const url = URL_SERVICIOS + `/forms/getcontrolsoptions/${tipooperacion}/${tipoinmueble}`;
		return this.http.get(url);
	}
	// obtiene las opciones de un control específico para admin>controles
	obtenerControlData(controlId: string) {
		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});
		const url = URL_SERVICIOS + `/forms/getcontroloptions/${controlId}`;

		return this.http.get(url, { headers })
			.pipe(
				// map((data: any) => data),
				catchError((err) => {
					return throwError(err); // Devuelve un error al suscriptor de mi observable.
				})
			);
	}
	// obtiene los filtros dadas las opciones TO y TI seleccionadas en filtros-dinamicos
	obtenerFiltros(to: string[], ti: string[]){
		console.log('to', to);
		console.log('ti', ti);
	}
	// setea una nueva configuracion de controles enviando un objeto (TO,TI,ID_CONTROLS)
	setFormControls(controls: any) {
		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
			'x-token': token
		});
		const url = URL_SERVICIOS + `/forms/setformcontrols`;
		return this.http.put(url, controls, { headers });
	}
	// muestra una oblea
	snack(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 2000,
		});
	}
}

