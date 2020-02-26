import { Component, OnInit, Inject, LOCALE_ID, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormsService } from '../../services/forms.service';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Localidad } from 'src/app/models/localidad.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-filtros',
	templateUrl: './filtros.component.html',
	styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit, OnDestroy {

	waitData: Subscription;
	// filtrosStorage va a guardar los filtros almacenados en la localStorage
	filtrosStorage: any;

	// Arrays donde voy a mapear con [(ngModel)] las opciones seleccionadas en cada filtro
	// Las declaro, pero no las inicializo, las necesito UNDEFINED porque en los divs de cada grupo de
	// filtros va a esperar con *ngIf a que esten definidas para presentarlos.
	selStrOperaciones: string[];
	selStrInmuebles: string[];
	selStrLocalidades: string[];

	// allFilters son arrays de string que contienen TODAS las opciones en caso de que sea seleccionada
	// la opcion INDISTINTO. No puedo enviar el array seleccionFilter porque con ngModel me estaría
	// chequeando las opciones en el mat-selection-list
	allStrOperaciones: string[] = [];
	allStrInmuebles: string[] = [];
	allStrLocalidades: string[] = [];

	// Al hacer click en un filtro, y a partir de los arrays de _ids seleccionados voy a reconstruir
	// los objetos para guardarlos en nuevos arrays para consumir los datos como el nombre de cada control
	// Esta información es usada en los BADGES.
	selObjOperaciones: object[];
	selObjInmuebles: object[];
	selObjLocalidades: Localidad[];
	objectLocalidadChecked: Localidad; // Ultima localidad seleccionada para guardar en posicion 0 del array

	// objetos que INCLUYEN 'indistinto'
	allObjLocalidades: any[];

	// Cada vez que se hace un click en el filtro le pido al componente padre que actualice las avisos.
	@Output() optionsSelected: EventEmitter<object> = new EventEmitter();
	@Output() mapCoords: EventEmitter<object> = new EventEmitter<object>(); // para enviar al mapa

	// Declaro un nuevo aviso de tipo JSON para poder utilizar sus metodos en el template. De esta manera
	// puedo guardar un objeto en el valor de cada control CHECK guardando los datos como un string.
	// [value]="JSON.stringify(inmueble)"

	JSON: JSON = JSON;


	constructor(
		public formsService: FormsService,
		@Inject(LOCALE_ID) private locale: string,
		private snackBar: MatSnackBar
	) {
	}

	async ngOnInit() {
		this.waitData = this.formsService.waitData().subscribe((data: any) => {
			if (data.ok) {
				// console.log(data); // {ok: true, contador: 1}
				this.storageToArraysIDs(); // Filters selected ID's
				this.filtersToObjects(); // Filter Selected
			} else {
				this.formsService.getControlsData();
			}
		},
			(err) => {
				console.log(err);
			});
	}

	ngOnDestroy() {
		this.waitData.unsubscribe();
	}

	storageToArraysIDs() {

		if (localStorage.getItem('filtros')) {

			this.selStrOperaciones = [];
			this.selStrInmuebles = [];
			this.selStrLocalidades = [];

			this.filtrosStorage = JSON.parse(localStorage.getItem('filtros'));

			// Ingresar los filtros en localstorage para OPERACIONES seleccionadas

			if (this.filtrosStorage.tipooperacion[0] === 'indistinto') {
				this.setIndistinto('operacion');
			} else {
				this.filtrosStorage.tipooperacion.forEach(operacion => {
					this.selStrOperaciones.push(operacion); // operacion es un string.
				});
			}

			// Ingresar los filtros en localstorage para INMUEBLES seleccionados

			if (this.filtrosStorage.tipoinmueble[0] === 'indistinto') {
				this.setIndistinto('inmueble');
			} else {
				this.filtrosStorage.tipoinmueble.forEach(inmueble => {
					this.selStrInmuebles.push(inmueble);
				});
			}

			// Obtengo las localidades guardadas en localstorage
			if (localStorage.getItem('localidades')) {
				this.allObjLocalidades = [];
				JSON.parse(localStorage.getItem('localidades')).forEach((localidad: any) => {
					this.allObjLocalidades.push(localidad);
				});
			}

			// Ingresar los filtros en localstorage para LOCALIDADES seleccionadas
			if (this.filtrosStorage.localidad[0] === 'indistinto') {
				this.setIndistinto('localidad');
			} else {
				this.filtrosStorage.localidad.forEach(localidad => {
					this.selStrLocalidades.push(localidad);
				});
			}

			this.filterUpdate();
		}
	}

	filtersToObjects() {

		// this.formsService.tiposOperaciones -> obtiene de la bd (necesita await)
		// this.formsService.tiposInmuebles -> obtiene de la bd (necesita await)
		// this.allObjLocalidades -> obtiene de la localstorage

		// las operaciones y los inmuebles son opciones fijas, representan un subuniverso que no cambia
		// las localidades en cambio no, representan un subuniverso seleccionado por el usuario y por lo tanto necesito
		// guardarlo en la localstorage para poder obtenerlo nuevamente en una próxima visita.

		this.selObjOperaciones = [];
		this.selObjInmuebles = [];
		this.selObjLocalidades = [];

		if (this.formsService.tiposOperaciones) {
			this.formsService.tiposOperaciones.forEach(operacion => {
				if (this.selStrOperaciones.includes(operacion._id)) { this.selObjOperaciones.unshift(operacion); }
			});
		}

		if (this.formsService.tiposInmuebles) {
			this.formsService.tiposInmuebles.forEach(inmueble => {
				if (this.selStrInmuebles.includes(inmueble._id)) { this.selObjInmuebles.unshift(inmueble); }
			});
		}

		if (localStorage.getItem('localidades')) {
			const allObjLocalidades = JSON.parse(localStorage.getItem('localidades'));
			allObjLocalidades.forEach((localidad: Localidad) => {
				// Si no existen selecciones en 'selStrLocalidades' puede ser que sea porque esta la opcion 'indistinto' seleccionada
				// lo que me obliga a utilizar el array allStrLocalidades que contiene TODAS las localidades del departamento.
				if (this.selStrLocalidades.includes(localidad._id)) {
					this.selObjLocalidades.push(localidad);
				}
			});
		}
	}

	setIndistinto(filter: string) {
		switch (filter) {
			case 'operacion':
				this.selStrOperaciones = ['indistinto'];
				this.formsService.tiposOperaciones.forEach(operacion => {
					if (operacion._id !== 'indistinto') {
						this.allStrOperaciones.push(operacion._id);
					}
				});
				break;
			case 'inmueble':
				this.selStrInmuebles = ['indistinto'];
				this.formsService.tiposInmuebles.forEach(inmueble => {
					if (inmueble._id !== 'indistinto') {
						this.allStrInmuebles.push(inmueble._id);
					}
				});
				break;
			case 'localidad':
				this.selStrLocalidades = ['indistinto'];
				this.allObjLocalidades.forEach(localidad => {
					if (localidad._id !== 'indistinto') {
						this.allStrLocalidades.push(localidad._id);
					}
				});
				break;
		}
	}

	async setLocalidad(localidad: Localidad) {
		this.selStrLocalidades = [];	// Limpio las selecciones anteriores
		this.selStrLocalidades.push(localidad._id);	//

		this.objectLocalidadChecked = localidad;	// Si hay solo una localidad CHECKED la envío al mapa
		// obtengo las localidades vecinas, necesito que sea sincrona porque cuando paso los filtros a objetos NECESITO TENER
		// las localidades cercanas en la localstorage, guardadas desde el servicio forms.service.ts
		await this.formsService.obtenerLocalidadesVecinas(localidad).then((localidades: Localidad[]) => {
			this.allObjLocalidades = localidades;
		});
		this.filterUpdate('localidad', localidad);
	}

	// actualiza el estdo de los CHECKS 
	filterUpdate(filter?: string, object?: any) {

		// Preparo los array de strings con los IDs de los checks seleccionados.
		if (filter) {
			switch (filter) {
				case 'operacion':
					this.allStrOperaciones = [];
					if (object._id === 'indistinto') { // quito todos los checks y seteo todas las opciones en mi nuevo array allStrOperaciones
						this.setIndistinto(filter);
					} else { // quito 'indistinto'
						if (this.selStrOperaciones.includes('indistinto')) { // si 'indistinto' esta seleccionado, lo quito.
							this.selStrOperaciones = this.selStrOperaciones.filter(operacion => operacion !== 'indistinto');
						} else { // si 'indistinto' NO esta seleccionado y no quedaron opciones, entonces "destildé" las opciones y tildo 'indistinto'
							if (this.selStrOperaciones.length === 0) {
								this.setIndistinto(filter);
							}
						}
					}
					break;

				case 'inmueble':
					this.allStrInmuebles = [];
					if (object._id === 'indistinto') {
						this.setIndistinto(filter);
					} else {
						if (this.selStrInmuebles.includes('indistinto')) {
							this.selStrInmuebles = this.selStrInmuebles.filter(inmueble => inmueble !== 'indistinto');
						} else {
							if (this.selStrInmuebles.length === 0) {
								this.setIndistinto(filter);
							}
						}
					}
					break;

				case 'localidad':
					this.allStrLocalidades = [];
					if (object._id === 'indistinto') {
						this.setIndistinto(filter);
					} else {
						if (this.selStrLocalidades.includes('indistinto')) {
							this.selStrLocalidades = this.selStrLocalidades.filter(localidad => localidad !== 'indistinto');
						} else {
							if (this.selStrLocalidades.length === 0) {
								this.setIndistinto(filter);
							}
						}
					}
					break;

			}
		}

		// Creo los objetos que van a guardar la data de los filtros seleccionados en los checks.
		this.filtersToObjects();

		// GUARDAR LAS OPCIONES EN MI OBJETO FILTROS
		// El objeto 'filtros' que será enviado con un EMIT al componente padre (avisos)
		const filtros = {
			tipooperacion: this.allStrOperaciones.length > 0 ? this.allStrOperaciones : this.selStrOperaciones,
			tipoinmueble: this.allStrInmuebles.length > 0 ? this.allStrInmuebles : this.selStrInmuebles,
			localidad: this.allStrLocalidades.length > 0 ? this.allStrLocalidades : this.selStrLocalidades
		};

		// GUARDAR LAS OPCIONES EN LA LOCALSTORAGE
		// Si existen valores en los arrays 'allStr' es que fue seleccionada la opción 'indistinto', en ese caso 
		// En localstorage NO guardo allStrOperaciones, allStrInmuebles, etc... sino directamente 'indistinto'
		localStorage.setItem('filtros', JSON.stringify({
			tipooperacion: this.allStrOperaciones.length > 0 ? ['indistinto'] : this.selStrOperaciones,
			tipoinmueble: this.allStrInmuebles.length > 0 ? ['indistinto'] : this.selStrInmuebles,
			localidad: this.allStrLocalidades.length > 0 ? ['indistinto'] : this.selStrLocalidades
		}));
		console.log(filtros);
		this.optionsSelected.emit(filtros);
		// CENTRAR EL MAPA SEGUN LAS LOCALIDADES SELECCIONADAS
		// promedio de coordenadas de localidades seleccionadas
		if (this.selObjLocalidades.length > 0 && this.selObjLocalidades[0]._id !== 'indistinto') {
			// Voy a centrar todas las localidades en el mapa para eso necesito el punto mas SO y el mas NE
			// lat -34.5768258, lng -58.4956705
			// lat 0 ecuador, lng 0 greenwich
			// SO: mas al sur MIN(lat) mas oeste MIN(lng)
			// NE: mas al norte MAX(lat) mas este MAX(lng)

			// localidad.geometry.coordinates[0] -> LNG -> OE
			// localidad.geometry.coordinates[1] -> LAT -> NS

			// Doy valores iniciales tomando el primer elemento de mi array de localidades.
			let O = Number(this.selObjLocalidades[0].geometry.coordinates[0]);
			let E = Number(this.selObjLocalidades[0].geometry.coordinates[0]);
			let S = Number(this.selObjLocalidades[0].geometry.coordinates[1]);
			let N = Number(this.selObjLocalidades[0].geometry.coordinates[1]);

			this.selObjLocalidades.forEach((localidad: Localidad) => {
				if (Number(localidad.geometry.coordinates[0]) > E) { E = Number(localidad.geometry.coordinates[0]); }
				if (Number(localidad.geometry.coordinates[0]) < O) { O = Number(localidad.geometry.coordinates[0]); }
				if (Number(localidad.geometry.coordinates[1]) > N) { N = Number(localidad.geometry.coordinates[1]); }
				if (Number(localidad.geometry.coordinates[1]) < S) { S = Number(localidad.geometry.coordinates[1]); }
			});

			// Cuando termino el forEach YA TENGO mi punto mas al SO y NE como ([S,O],[N,E])
			// envio un PROMEDIO de coordenadas de las localidades seleccionadas.

			const coords = [[O, S], [E, N]];
			this.mapCoords.emit(coords);
		}

	}

	removeFilter(filter: string, object: any) {
		switch (filter) {
			case 'localidad':
				this.selStrLocalidades = this.selStrLocalidades.filter(localidad => localidad !== object._id);
				break;
			case 'operacion':
				this.selStrOperaciones = this.selStrOperaciones.filter(operacion => operacion !== object._id);
				break;
			case 'inmueble':
				this.selStrInmuebles = this.selStrInmuebles.filter(inmueble => inmueble !== object._id);
				break;
		}
		this.filterUpdate(filter, object);
	}
}
