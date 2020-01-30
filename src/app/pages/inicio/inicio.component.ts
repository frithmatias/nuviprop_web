import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService, AvisosService } from 'src/app/services/services.index';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { Router } from '@angular/router';

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
		private avisosService: AvisosService,
		private router: Router
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
		// setLocalidad() es un metodo que se encuentra en los componentes INICIO y AVISO, se llama localmente y luego
		// se llama al metodo setLocalidad() en el servicio formsService, que setea globalmente el nombre compuesto de
		// la localidad seleccionada, y luego busca localidades cercanas. En el componente de FILTROS no se necesita
		// invocar a este metodo localmente, porque NO NECESITA setear el _id para submitirlo, como SI es necesario en
		// INICIO (push) y AVISO (patchValue) porque se trata de componenentes en un formulario. El componente FILTROS
		// SOLO necesita setear en lombre compuesto, y luego buscar localidades cercanas.
		this.formsService.setLocalidad(localidad);
		this.seleccionLocalidades = [];
		this.seleccionLocalidades.push(localidad._id);
	}

	submitForm() {

		const filtros = {
			tipooperacion: this.seleccionOperaciones,
			tipoinmueble: this.seleccionInmuebles,
			localidad: this.seleccionLocalidades
		};

		localStorage.setItem('filtros', JSON.stringify(filtros));
		
		// this.formsService.cleanInput();
		this.avisosService.obtenerAvisos(filtros).then((res: string) => {
			this.snak(res, 2000);
			this.router.navigate(['/avisos']);
		}).catch((err) => {
			this.snak(err, 2000);
		});



	}

	snak(msg: string, time: number) {
		this.snackBar.open(msg, 'Aceptar', {
			duration: time,
		});
	}
}
