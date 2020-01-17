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
	seleccionOperaciones: string[] = [];
	seleccionInmuebles: string[] = [];
	seleccionLocalidades: string[] = [];
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
		this.seleccionOperaciones = [];
		this.seleccionOperaciones.push(tipooperacion._id);
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
		this.seleccionInmuebles = [];
		this.seleccionInmuebles.push(tipoinmueble._id);
	}

	setLocalidad(localidad) {
		this.seleccionLocalidades = [];
		this.seleccionLocalidades.push(localidad._id);
		this.formsService.setLocalidad(localidad);
	}

	submitForm() {

		let filtros = {
			tipooperacion: this.seleccionOperaciones,
			tipoinmueble: this.seleccionInmuebles,
			localidad: this.seleccionLocalidades
		}

		localStorage.setItem('filtros', JSON.stringify(filtros));
		console.log(filtros);

		if (filtros.localidad.length > 0 && filtros.tipoinmueble.length > 0 && filtros.tipooperacion.length > 0) {
			this.formsService.cleanInput();
			this.avisosService.obtenerAvisos(filtros);
		} else {
			this.snackBar.open('Faltan datos, por favor verifique.', 'Aceptar', {
				duration: 2000,
			});
		}
	}
}
