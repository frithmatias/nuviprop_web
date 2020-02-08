import { Component, OnInit, Inject, LOCALE_ID, Output, EventEmitter } from '@angular/core';
import { FormsService } from '../forms.service';
import { formatDate } from '@angular/common';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { AvisosService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Localidad } from 'src/app/models/localidad.model';
import { Observable } from 'rxjs';
import { TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';


@Component({
	selector: 'app-filtros',
	templateUrl: './filtros.component.html',
	styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit {

	divfiltersoperaciones = true;
	divfiltersinmuebles = true;
	divfilterslocalidades = true;

	// filtrosStorage va a guardar los filtros almacenados en la localStorage
	filtrosStorage: any;

	// Arrays donde voy a mapear con [(ngModel)] las opciones seleccionadas en cada filtro 
	// Las declaro, pero no las inicializo, las necesito UNDEFINED porque en los divs de cada grupo de 
	// filtros va a esperar con *ngIf a que esten definidas para presentarlos.
	seleccionOperaciones: string[];
	seleccionInmuebles: string[];
	seleccionLocalidades: string[];

	// allFilters son arrays de string que contienen TODAS las opciones en caso de que sea seleccionada 
	// la opcion INDISTINTO. No puedo enviar el array seleccionFilter porque con ngModel me estaría 
	// chequeando las opciones en el mat-selection-list
	allOperaciones: string[] = [];
	allInmuebles: string[] = [];
	allLocalidades: string[] = [];

	// Al hacer click en un filtro, y a partir de los arrays de _ids seleccionados voy a reconstruir 
	// los objetos para guardarlos en nuevos arrays para consumir los datos como el nombre de cada control
	// Esta información es usada en los BADGES.
	objectsOperaciones: object[];
	objectsInmuebles: object[];
	objectsLocalidades: object[];
	objectLocalidadChecked: Localidad; // Ultima localidad seleccionada para guardar en posicion 0 del array

	// Cada vez que se hace un click en el filtro le pido al componente padre que actualice las avisos.
	@Output() optionsSelected: EventEmitter<object> = new EventEmitter();
	@Output() localidadesActivas: EventEmitter<object[]> = new EventEmitter<object[]>(); // para enviar al mapa

	// Declaro un nuevo aviso de tipo JSON para poder utilizar sus metodos en el template. De esta manera
	// puedo guardar un objeto en el valor de cada control CHECK guardando los datos como un string.
	// [value]="JSON.stringify(inmueble)"

	JSON: JSON = JSON;


	constructor(
		private formsService: FormsService,
		@Inject(LOCALE_ID) private locale: string,
		private capitalizarPipe: CapitalizarPipe,
		private avisosService: AvisosService,
		private snackBar: MatSnackBar
	) {
		// console.log('DATE:', formatDate(new Date(), 'yyyy-MM-dd', this.locale));
	}

	ngOnInit() {
		this.storageToArraysIDs(); // Filters selected ID's
		this.filtersToObjects(); // Filter Selected
	}

	storageToArraysIDs() {

		this.filtrosStorage = JSON.parse(localStorage.getItem('filtros'));

		this.seleccionOperaciones = [];
		this.seleccionInmuebles = [];
		this.seleccionLocalidades = [];

		this.filtrosStorage.tipooperacion.forEach(operacion => {
			this.seleccionOperaciones.push(operacion); // operacion es un string.
		});

		this.filtrosStorage.tipoinmueble.forEach(inmueble => {
			this.seleccionInmuebles.push(inmueble);
		});

		this.filtrosStorage.localidad.forEach(localidad => {
			this.seleccionLocalidades.push(localidad);
		});

	}

	filtersToObjects() {
		// this.formsService.tiposOperaciones -> obtiene de la bd (necesita await)
		// this.formsService.tiposInmuebles -> obtiene de la bd (necesita await)
		// this.formsService.localidadesCercanas -> obtiene de la localstorage

		// las operaciones y los inmuebles son opciones fijas, representan un subuniverso que no cambia
		// las localidades en cambio no, representan un subuniverso seleccionado por el usuario y por lo tanto necesito 
		// guardarlo en la localstorage para poder obtenerlo nuevamente en una próxima visita.

		this.objectsOperaciones = [];
		this.objectsInmuebles = [];
		this.objectsLocalidades = [];

		if (this.formsService.tiposOperaciones) {
			this.formsService.tiposOperaciones.forEach(operacion => {
				if (this.seleccionOperaciones.includes(operacion._id)) this.objectsOperaciones.unshift(operacion);
			})
		}

		if (this.formsService.tiposInmuebles) {
			this.formsService.tiposInmuebles.forEach(inmueble => {
				if (this.seleccionInmuebles.includes(inmueble._id)) this.objectsInmuebles.unshift(inmueble);
			})
		}

		if (localStorage.getItem('localidades')) {
			let localidadesCercanas = JSON.parse(localStorage.getItem('localidades'));
			localidadesCercanas.forEach(localidad => {
				if (this.seleccionLocalidades.includes(localidad._id)) {
					if (this.objectLocalidadChecked && (localidad._id === this.objectLocalidadChecked._id)) {
						this.objectsLocalidades.unshift(localidad);
					} else {
						this.objectsLocalidades.push(localidad);
					}
				}
			})

		}


	}

	checkAllOptions(filter: string) {
		switch (filter) {
			case 'operacion':
				this.seleccionOperaciones = ["indistinto"];
				this.formsService.tiposOperaciones.forEach(operacion => {
					if (operacion._id != "indistinto") {
						this.allOperaciones.push(operacion._id);
					}
				});
				break;
			case 'inmueble':
				this.seleccionInmuebles = ["indistinto"];
				this.formsService.tiposInmuebles.forEach(inmueble => {
					if (inmueble._id != "indistinto") {
						this.allInmuebles.push(inmueble._id);
					}
				});
				break;
			case 'localidad':
				this.seleccionLocalidades = ["indistinto"];
				this.formsService.localidadesCercanas.forEach(localidad => {
					if (localidad._id != "indistinto") {
						this.allLocalidades.push(localidad._id);
					}
				});
				break;
		}
	}


	filterUpdate(filter?: string, id?: string) {
		switch (filter) {
			case 'operacion':
				this.allOperaciones = [];
				if (id === "indistinto") { // quito todos los checks y seteo todas las opciones en mi nuevo array allOperaciones
					this.checkAllOptions(filter);
				} else { // quito 'indistinto'
					if (this.seleccionOperaciones.includes("indistinto")) { // si 'indistinto' esta seleccionado, lo quito.
						this.seleccionOperaciones = this.seleccionOperaciones.filter(operacion => operacion != "indistinto");
					} else { // si 'indistinto' NO esta seleccionado y no quedaron opciones, entonces "destildé" las opciones y tildo 'indistinto'
						if (this.seleccionOperaciones.length === 0) {
							this.checkAllOptions(filter);
						}
					}
				}
				break;

			case 'inmueble':
				this.allInmuebles = [];
				if (id === "indistinto") { 
					this.checkAllOptions(filter);
				} else { 
					if (this.seleccionInmuebles.includes("indistinto")) {
						this.seleccionInmuebles = this.seleccionInmuebles.filter(inmueble => inmueble != "indistinto");
					} else {
						if (this.seleccionInmuebles.length === 0) {
							this.checkAllOptions(filter);
						}
					}
				}
				break;

				case 'localidad':
					this.allLocalidades = [];
					if (id === "indistinto") { 
						this.checkAllOptions(filter);
					} else {
						if (this.seleccionLocalidades.includes("indistinto")) {
							this.seleccionLocalidades = this.seleccionLocalidades.filter(localidad => localidad != "indistinto");
						} else {
							if (this.seleccionLocalidades.length === 0) {
								this.checkAllOptions(filter);
							}
						}
					}
					break;

		}

		this.filtersToObjects();

		const filtros = {
			tipooperacion: this.allOperaciones.length > 0 ? this.allOperaciones : this.seleccionOperaciones,
			tipoinmueble: this.allInmuebles.length > 0 ? this.allInmuebles : this.seleccionInmuebles,
			localidad: this.allLocalidades.length > 0 ? this.allLocalidades : this.seleccionLocalidades
		};

		console.log(filtros);
		localStorage.setItem('filtros', JSON.stringify(filtros));


		if (filtros.localidad.length === 0) {
			this.snak('Seleccione una Localidad.', 2000);
			return;
		}
		if (filtros.tipooperacion.length === 0) {
			this.snak('Seleccione un tipo de Operacion.', 2000);
			return;
		}
		if (filtros.tipoinmueble.length === 0) {
			this.snak('Seleccione un tipo de Inmueble.', 2000);
			return;
		}


		this.localidadesActivas.emit(this.objectsLocalidades);
		this.optionsSelected.emit(filtros);

	}

	removeFilter(filter: string, id: string) {
		console.log('removiendo filtro: ', filter, id);
		switch (filter) {
			case 'localidad':
				this.seleccionLocalidades = this.seleccionLocalidades.filter(localidad => localidad != id);
				break;
			case 'operacion':
				this.seleccionOperaciones = this.seleccionOperaciones.filter(operacion => operacion != id);
				break;
			case 'inmueble':
				this.seleccionInmuebles = this.seleccionInmuebles.filter(inmueble => inmueble != id);
				break;
		}
		this.filterUpdate(filter, id);
	}


	tabSelected(tab: number) {
		localStorage.setItem('viewtab', String(tab));
	}


	setLastLocalidad(object: Localidad) {
		this.objectLocalidadChecked = object;
		this.filterUpdate('localidad', object._id);
	}


	snak(msg: string, time: number) {
		this.snackBar.open(msg, 'Aceptar', {
			duration: time,
		});
	}
}
