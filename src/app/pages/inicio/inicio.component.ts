import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService, AvisosService } from 'src/app/services/services.index';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, catchError } from 'rxjs/operators';
import { TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { TipoInmueble } from 'src/app/models/aviso_tipoinmueble.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { throwError } from 'rxjs';
@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	seleccionOperaciones: string[] = [];
	seleccionInmuebles: string[] = [];
	seleccionLocalidades: string[] = [];

	tiposOperaciones: TipoOperacion[];
	tiposInmuebles: TipoInmueble[];

	failCounter = 0;
	constructor(
		public formsService: FormsService,
		private snackBar: MatSnackBar,
		private capitalizarPipe: CapitalizarPipe,
		private avisosService: AvisosService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	async ngOnInit() {

		// Cargo los scripts fuera del scope de Angular.
		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).pipe(
			map(() => this.activatedRoute))
			.subscribe((event) => {

				// $.getScript('../assets/plugins/jquery/jquery.min.js');
				// init_plugins();
				//  $.getScript('../assets/plugins/bootstrap/js/popper.min.js');
				//  $.getScript('../assets/plugins/bootstrap/js/bootstrap.min.js');
				//  $.getScript('../assets/js/perfect-scrollbar.jquery.min.js');
				//  $.getScript('../assets/js/sidebarmenu.js');
				$.getScript('../assets/js/custom.js');
			});


		// Espera a que los datos esten disponibles en el servicio
		if (this.formsService.tiposOperaciones && this.formsService.tiposInmuebles) {
			this.setData();
		} else {
			this.formsService.waitData()
				.pipe(catchError((err) => throwError(err)))
				.subscribe(
					(data: any) => {
						if (data.ok) {
							this.setData();
						} else {
							this.failCounter = data.contador;
						}
					},
					(err) => {
					}
				);

		}


	}

	setData() {
		this.tiposInmuebles = this.formsService.tiposInmuebles.filter(inmueble => inmueble._id !== 'indistinto');
		this.tiposOperaciones = this.formsService.tiposOperaciones.filter(operacion => operacion._id !== 'indistinto');
		this.getLocalStorage();
	}

	getLocalStorage() {
		// Si ya hubo una busqueda anterior y existen filtros en localstorage se redirecciona a /avisos
		if (localStorage.getItem('filtros')) {

			const filtros: any = JSON.parse(localStorage.getItem('filtros'));

			// Una vez en avisos, vuelvo a verificar, si falta un dato vuelve a 'inicio'
			if ((filtros.tipooperacion.length > 0) && (filtros.tipoinmueble.length > 0) && (filtros.localidad.length > 0)) {
				this.router.navigate(['/avisos']);
			} else {
				this.snak('Faltan datos verifique.', 2000);
				return;
			}
		} else {
			this.snak('Seleccione opciones de búsqueda.', 2000);
			return;
		}
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
		this.formsService.obtenerLocalidadesVecinas(localidad);
		this.seleccionLocalidades = [];
		this.seleccionLocalidades.push(localidad._id);
	}

	submitForm() {

		const filtros = {
			tipooperacion: this.seleccionOperaciones,
			tipoinmueble: this.seleccionInmuebles,
			localidad: this.seleccionLocalidades
		};

		if ((filtros.tipooperacion.length > 0) && (filtros.tipoinmueble.length > 0) && (filtros.localidad.length > 0)) {
			localStorage.setItem('filtros', JSON.stringify(filtros));
			this.router.navigate(['/avisos']); // En avivos hace la búsqueda con los datos en la localstorage
		} else {
			this.snak('Faltan datos verifique.', 2000);
			return;
		}
	}

	snak(msg: string, time: number) {
		this.snackBar.open(msg, 'Aceptar', {
			duration: time,
		});
	}
}
