import { Component, OnInit, Inject, LOCALE_ID, Output, EventEmitter } from '@angular/core';
import { FormsService } from '../forms.service';
import { formatDate } from '@angular/common';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { AvisosService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Localidad } from 'src/app/models/localidad.model';


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

	// Al hacer click en un filtro, y a partir de los arrays de _ids seleccionados voy a reconstruir 
	// los objetos para guardarlos en nuevos arrays para consumir los datos como el nombre de cada control.
	objectsOperaciones = [];
	objectsInmuebles = [];
	objectsLocalidades = [];
	objectLocalidadChecked: Localidad; // Ultima localidad seleccionada para guardar en posicion 0 del array
	// Cada vez que se hace un click en el filtro le pido al componente padre que actualice las avisos.
	@Output() optionSelected: EventEmitter<object> = new EventEmitter();
	@Output() localidadesActivas: EventEmitter<object[]> = new EventEmitter(); // para enviar al mapa

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

	// Setea el modo de vista seleccionado para que lo levante la page 'avisos'
	tabSelected(tab: number) {
		localStorage.setItem('viewtab', String(tab));
	}

	storageToArraysIDs(){

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

		this.formsService.tiposOperaciones.forEach(operacion => {
			if (this.seleccionOperaciones.includes(operacion._id)) this.objectsOperaciones.unshift(operacion);
		})
		this.formsService.tiposInmuebles.forEach(inmueble => {
			if (this.seleccionInmuebles.includes(inmueble._id)) this.objectsInmuebles.unshift(inmueble);
		})
		if(this.formsService.localidadesCercanas !== undefined && this.objectLocalidadChecked !== undefined){
			this.formsService.localidadesCercanas.forEach(localidad => {
				if (this.seleccionLocalidades.includes(localidad._id)) {
					if(localidad._id === this.objectLocalidadChecked._id){
						this.objectsLocalidades.unshift(localidad);
					} else {
						this.objectsLocalidades.push(localidad);
					}
				} 
			})
		}
		
	}


	setLastLocalidad(object: Localidad){
		this.objectLocalidadChecked = object;
		this.filterUpdate();
	}

	filterUpdate() {
		this.filtersToObjects();
		// al hacer un unshift() pongo arriba el ultimo elemento, de modo que al seleccionar el primer elemento 
		// me aseguro de enviar el último elemento seleccionado.
		this.localidadesActivas.emit(this.objectsLocalidades);

		// los filtros en seleccionOperaciones, seleccionInmuebles, seleccionLocalidades
		// son array de strings que van directo al metodo obtenerAvisos(filtros) desde
		// el componente padre.
		const filtros = {
			tipooperacion: this.seleccionOperaciones,
			tipoinmueble: this.seleccionInmuebles,
			localidad: this.seleccionLocalidades
		};

		// guardo los filtros en la localstorage para recuperarlos al recargar la página. 
		// Para las localidades, ademas guardo en la localstorage el último resultado de localidadesVecinas.
		localStorage.setItem('filtros', JSON.stringify(filtros));

		// Le aviso al padre que hice cambios en los filtors, que busque nuevas avisos.
		this.optionSelected.emit(filtros);
	}


}
