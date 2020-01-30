import { Component, OnInit, Inject, LOCALE_ID, Output, EventEmitter } from '@angular/core';
import { FormsService } from '../forms.service';
import { formatDate } from '@angular/common';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { AvisosService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';


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

	// Arrays donde voy a guardar las opciones seleccionadas en los filtros (OBJETOS CONVERTIDOS A STRING)
	seleccionOperaciones = [];
	seleccionInmuebles = [];
	seleccionLocalidades = [];

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

		// Obtengo los datos del formulario guardados en la localstorage
		this.filtrosStorage = JSON.parse(localStorage.getItem('filtros'));
		// Guardo los datos por defecto para mostrar los CHECKS seleccionados en cada lista
		// TIPOS DE OPERACION (VALORES SELECCIONADOS)
		this.filtrosStorage.tipooperacion.forEach(operacion => {
			this.seleccionOperaciones.push(operacion); // operacion es un string.
		});

		// TIPOS DE INMUEBLE (VALORES SELECCIONADOS)
		this.filtrosStorage.tipoinmueble.forEach(inmueble => {
			this.seleccionInmuebles.push(inmueble);
		});

		// LOCALIDADES (VALORES SELECCIONADOS)
		this.filtrosStorage.localidad.forEach(localidad => {
			this.seleccionLocalidades.push(localidad);
		});


	}

	// Setea el modo de vista seleccionado para que lo levante la page 'avisos'
	tabSelected(tab: number) {
		localStorage.setItem('viewtab', String(tab));
	}


	filterUpdate(controlname: string, object: any) {
		let localidadesVecinas = JSON.parse(localStorage.getItem('localidades'));
		let localidadesSeleccionadas = [];
		if (controlname === 'localidad') { // operacion sólo para checks de localidades
			// se hizo un click en un check de los filtros de localidad, tengo que agarrar TODAS las 
			// localidades vecinas de la localstorage y cruzarlas con las que fueron seleccionadas. 
			// De manera de enviarle al mapa SOLO las localidades deseadas.
			localidadesVecinas.forEach(localidad => {
				if(this.seleccionLocalidades.includes(localidad._id)){
					// aca estan los OBJETOS completos de las localidades seleccionadas 
					if(localidad._id === object._id){
						// si ademas dentro de las localidades seleccionadas, esta la localidad 
						// a la que yo le hice click, la pongo en la posición 0 para que sea la 
						// localidad en la cual se va a focalizar el centro del mapa.
						localidadesSeleccionadas.unshift(localidad);
					} else {
						localidadesSeleccionadas.push(localidad);
					}
				}
			})
		}
		this.localidadesActivas.emit(localidadesSeleccionadas[0]);

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
