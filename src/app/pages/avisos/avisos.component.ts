import { Component, OnInit, HostListener } from '@angular/core';
import { AvisosService, FormsService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso, Avisos } from 'src/app/models/aviso.model';
import { Router } from '@angular/router';
import { Form } from 'src/app/models/form.model';

interface Ordenamientos {
	by: string;
	order: string;
	label: string;
}

@Component({
	selector: 'app-avisos',
	templateUrl: './avisos.component.html',
	styleUrls: ['./avisos.component.scss']
})

export class AvisosComponent implements OnInit {
	private INFINITESCROLL_THRESHOLD = 80;
	public showGoUpButton: boolean;
	private getMoreAvisos = false;
	mapCoords: []; // viene de un emit del formulario filtros
	showScrollHeight = 400;
	hideScrollHeight = 200;
	cargando = false;
	avisos: Aviso[];
	filtros = []; // obtengo los controles para cada TI, TO y los ingreso como filtros.
	ordenadoPorPrecio = false;
	ordenPorPrecio: string; //ASC o DESC

	ordenamientos: Ordenamientos[] = [
		{ by: 'precio', order: 'asc', label: 'Menor Precio' },
		{ by: 'precio', order: 'desc', label: 'Mayor Precio' },
		{ by: 'calle', order: 'asc', label: 'Calle' },
		{ by: 'codigopostal', order: 'asc', label: 'Código Postal' }
	];

	constructor(
		private router: Router,
		private avisosService: AvisosService,
		private formsService: FormsService,
		private snackBar: MatSnackBar
	) {
		this.showGoUpButton = false;
	}

	ngOnInit() {

		this.cambiarTab(Number(localStorage.getItem('viewtab')) || 0);
		this.scrollTop(); // envio el scroll hacia arriba

		if (localStorage.getItem('filtros')) {
			const filtros = JSON.parse(localStorage.getItem('filtros'));
			if ((filtros.tipooperacion.length > 0) && (filtros.tipoinmueble.length > 0) && (filtros.localidad.length > 0)) {
				// Los avisos vienen llamados por los filtros cuando son seteados automáticamente los criterios
				// de búsqueda (checks), no es necesario volver a buscar.

				// this.avisosService.obtenerAvisos(filtros).then((res: string) => {
				// 	this.snak(res, 2000);
				// }).catch((err) => {
				// 	this.snak(err.statusText || err, 2000);
				// });
			} else {
				this.router.navigate(['/inicio']);
			}
		} else {
			this.router.navigate(['/inicio']);
		}
	}

	// busca avisos en titulos y descripciones desde el input
	buscarAviso(termino: string) {
		// /^[a-z0-9]+$/i
		// ^         Start of string
		// [a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
		// +         one or more times (change to * to allow empty string)
		// $         end of string
		// /i        case-insensitive

		if (termino.length <= 0) {

			const filtros = JSON.parse(localStorage.getItem('filtros'));
			this.obtenerAvisos(filtros);
			return;
		}

		const regex = new RegExp(/^[a-z0-9]+$/i);
		if (regex.test(termino)) {
			this.cargando = true;
			this.avisosService.buscarAviso(termino).subscribe((resp: any) => {
				this.avisos = resp.avisos;
				this.cargando = false;
			});
		} else {
			this.snackBar.open('¡Ingrese sólo caracteres alfanuméricos!', 'Aceptar', {
				duration: 2000,
			});
		}
	}



	obtenerAvisosFiltros(filtros: Filtros) {
		this.obtenerAvisos(filtros);
		this.obtenerFiltrosAvanzados(filtros);

	}
	// obtiene avisos según criterio de búsqueda (viene desde filtros)
	obtenerAvisos(filtros: Filtros) {
		this.avisosService.obtenerAvisos(filtros).then((data: Avisos) => {
			this.avisos = data.avisos;
			const res = `Se obtuvieron ${data.total} avisos`;
			this.snak(res, 2000);
		}).catch((err) => {
			this.avisos = [];
			this.snak(err, 5000);
		});
	}

	// Para obtener los filtros de forma sincrona puedo usar for en lugar de forEach
	// async obtenerFiltrosAvanzados(filtros: Filtros) {
	// 	for (const to of filtros.tipooperacion) {
	// 		for (const ti of filtros.tipoinmueble) {
	// 			console.log('consultando ', to, ti);
	// 			await this.consultar().then(() => {
	// 				console.log('terminado');
	// 			})
	// 		}
	// 	}
	// }
	obtenerFiltrosAvanzados(filtros: Filtros) {

		const controlsIDs = []; // cargo los IDs para evitar ingresar dos veces un mismo control.
		filtros.tipoinmueble.forEach(ti => {
			filtros.tipooperacion.forEach(to => {
				this.formsService.obtenerFormControlsAndOptions(to, ti)
				.subscribe((data: Form) => {
					if (data && data.ok) {
						data.controls.forEach(control => {
							if (!controlsIDs.includes(control._id)) {
								this.filtros.push(control);
								controlsIDs.push(control._id);
							}
						});
					}
				});
			});
		});
	}

	ordenar(option: Ordenamientos) {
		this.avisos = [...this.avisos.sort(this.compareValues(option.by, option.order).bind(this))];
	}

	compareValues(key, order = 'asc') {
		return (a, b) => {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				// la propiedad no existe en ningún objeto
				return 0;
			}
			let varA: any;
			let varB: any;
			if (key === 'precio') { // los precios se comparan en PESOS al tipo de cambio del día.
				varA = (a.tipocambio.nombre === 'Pesos') ? a[key] : a[key] * this.formsService.valorDolar;
				varB = (b.tipocambio.nombre === 'Pesos') ? b[key] : b[key] * this.formsService.valorDolar;
			} else {
				varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
				varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
			}
			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}

			return (
				(order === 'desc') ? (comparison * -1) : comparison
			);
		};
	}

	cambiarTab(tab: number) {
		// guardo en el servico el tab seleccionado por última vez, para que al volver de
		// ver un aviso, quede seleccionado el ultimo tab seleccionado.
		const tabMapa: any = document.getElementById('mapa-tab');
		const tabLista: any = document.getElementById('lista-tab');
		const tabCards: any = document.getElementById('cards-tab');

		const contentMapa: any = document.getElementById('mapa');
		const contentLista: any = document.getElementById('lista');
		const contentCards: any = document.getElementById('cards');

		// desactivo los tabs
		tabMapa.classList.remove('active');
		tabLista.classList.remove('active');
		tabCards.classList.remove('active');

		// desactivo los contenidos
		contentMapa.classList.remove('show.active');
		contentLista.classList.remove('show.active');
		contentCards.classList.remove('show.active');

		const contents: any = document.getElementsByClassName('tab-pane');

		// activo el tab correspondiente al ultimo seleccionado guardado en el servicio.
		switch (tab) {
			case 0:
				tabMapa.classList.add('active');
				contentMapa.classList.add('show', 'active');
				break;
			case 1:
				tabLista.classList.add('active');
				contentLista.classList.add('show', 'active');
				break;
			case 2:
				tabCards.classList.add('active');
				contentCards.classList.add('show', 'active');
				break;
			default:
				tabMapa.classList.add('active');
				contentMapa.classList.add('show', 'active');
				break;
		}
	}

	scrollTop() {
		document.body.scrollTop = 0; // Safari
		document.documentElement.scrollTop = 0; // Other
	}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		if ((window.pageYOffset ||
			document.documentElement.scrollTop ||
			document.body.scrollTop) > this.showScrollHeight) {
			this.showGoUpButton = true;
		} else if (this.showGoUpButton &&
			(window.pageYOffset ||
				document.documentElement.scrollTop ||
				document.body.scrollTop)
			< this.hideScrollHeight) {
			this.showGoUpButton = false;
		}
	}

	snak(msg: string, time: number) {
		this.snackBar.open(msg, 'Aceptar', {
			duration: time,
		});
	}

	avisosChange(e: any) {
		// si sólo modifico propiedades o elementos dentro de un array, el ciclo de detección de cambios
		// en el componente hijo no detecta los cambios porque le estoy pasando el mismo objeto, para que
		// el componente hijo pueda detectar que le estoy pasando datos nuevos tengo que pasar un array
		// NUEVO y para eso uso el operador SPREAD.
		this.avisos = [...e];
	}

	tabSelected(tab: number) {
		localStorage.setItem('viewtab', String(tab));
	}
}

interface Filtros {
	tipooperacion: string[];
	tipoinmueble: string[];
	localidad: string[];
}
