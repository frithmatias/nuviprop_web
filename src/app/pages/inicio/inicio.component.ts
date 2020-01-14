import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService, AvisosService } from 'src/app/services/services.index';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';

declare function init_plugins();

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

	constructor(
		private formsService: FormsService,
		private snackBar: MatSnackBar,
		private capitalizarPipe: CapitalizarPipe,
		private avisosService: AvisosService
	) { }

	ngOnInit() {
		init_plugins();
	}


	setOperacion(tipooperacion: any, link?: HTMLElement) {
		let storage = {};
		storage = JSON.parse(localStorage.getItem('filtros')) || {};
		storage['tipooperacion'] = [];
		storage['tipooperacion'].push(JSON.stringify(tipooperacion));
		localStorage.setItem('filtros', JSON.stringify(storage));
		// dejo seleccionado el boton con la clase 'active'

		if (link) {
			const botones: any = document.getElementsByName('boton_tipo_operacion');
			// si la opcion se selecciono desde el select no existen botones
			// (cuando la pantalla es chica los botones desaparecen y aparece un select)
			for (const ref of botones) {
				ref.classList.remove('active');
			}
			link.classList.add('active');
		}
	}

	setInmueble(tipoinmueble) {
		let storage = {};
		storage = JSON.parse(localStorage.getItem('filtros')) || {};
		storage['tipoinmueble'] = [];
		storage['tipoinmueble'].push(JSON.stringify(tipoinmueble));
		localStorage.setItem('filtros', JSON.stringify(storage));
	}


	submitForm() {
		let storage = JSON.parse(localStorage.getItem('filtros'));
		console.log(storage);
		if (storage && storage.localidad.length > 0) {
			this.formsService.cleanInput();
			this.avisosService.obtenerAvisos();
		} else {
			this.snackBar.open('Por favor ingrese una localidad.', 'Aceptar', {
				duration: 2000,
			});
			return;
		}

	}
}
