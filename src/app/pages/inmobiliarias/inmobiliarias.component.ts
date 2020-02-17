import { Component, OnInit } from '@angular/core';
import { Inmobiliaria } from '../../models/inmobiliaria.model';
import { InmobiliariaService } from '../../services/services.index';
import Swal from 'sweetalert2';

declare var swal: any;

@Component({
	selector: 'app-inmobiliarias',
	templateUrl: './inmobiliarias.component.html',
	styles: []
})
export class InmobiliariasComponent implements OnInit {
	inmobiliarias: Inmobiliaria[] = [];

	constructor(
		public inmobiliariaService: InmobiliariaService
	) { }

	ngOnInit() {
		this.obtenerInmobiliarias();
	}

	buscarInmobiliaria(termino: string) {
		if (termino.length <= 0) {
			this.obtenerInmobiliarias();
			return;
		}

		this.inmobiliariaService
			.buscarInmobiliaria(termino)
			.subscribe(inmobiliarias => (this.inmobiliarias = inmobiliarias));
	}

	obtenerInmobiliarias() {
		this.inmobiliariaService
			.obtenerInmobiliarias()
			.subscribe(inmobiliarias => (this.inmobiliarias = inmobiliarias));
	}

	guardarInmobiliaria(inmobiliaria: Inmobiliaria) {
		this.inmobiliariaService.actualizarInmobiliaria(inmobiliaria).subscribe();
	}

	borrarInmobiliaria(inmobiliaria: Inmobiliaria) {
		console.log(inmobiliaria);
		this.inmobiliariaService
			.borrarInmobiliaria(inmobiliaria._id)
			.subscribe(() => this.obtenerInmobiliarias());
	}

	crearInmobiliaria() {
		Swal.fire({
			title: 'Alta de Inmobiliaria',
			text: 'Ingrese el nombre de la inmobiliaria',
			input: 'text',
			icon: 'info',
			showCancelButton: true
		}).then((valor: any) => {
			console.log(valor.value);
			if (!valor.value || valor.value.length === 0) {
				return;
			}
			console.log(valor.value);
			this.inmobiliariaService
				.crearInmobiliaria(valor.value)
				.subscribe(() => this.obtenerInmobiliarias());
		});
	}

}
