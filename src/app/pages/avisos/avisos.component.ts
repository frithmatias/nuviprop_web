import { Component, OnInit, HostListener } from '@angular/core';
import { AvisosService, FormsService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso, Avisos } from 'src/app/models/aviso.model';
import { Router } from '@angular/router';

interface Ordenamientos {
	value: string;
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

	ordenadoPorPrecio = false;
	ordenPorPrecio: string; //ASC o DESC

	ordenamientos: Ordenamientos[] = [
		{ value: 'preciomenor', label: 'Menor Precio' },
		{ value: 'preciomayor', label: 'Mayor Precio' },
	];

	constructor(
		private snackBar: MatSnackBar,
		private avisosService: AvisosService,
		private router: Router
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

	// obtiene avisos según criterio de búsqueda (viene desde filtros)
	obtenerAvisos(filtros: any) {
		this.avisosService.obtenerAvisos(filtros).then((data: Avisos) => {
			this.avisos = data.avisos;
			const res = `Se obtuvieron ${data.total} avisos`;
			this.snak(res, 2000);
		}).catch((err) => {
			this.avisos = [];
			this.snak(err, 5000);
		});
	}


	// primero? si, menor? si -> unshift();
	// primero? si, menor? no -> nada (es el primero, tiene que haber otro elemento!)
	// primero? no, menor? si -> splice(); 
	// primero? no, menor? no -> ultimo? si -> push(), no -> nada

	// avisos	avisosorden
	// 310      -> 123 unshift() 
	// 123		-> 310 push()
	// 212 		
	// 345 
	// 984 

	ordenarAvisosPrecio(orden: string) {
		// ordeno de menor a mayor
		if (!this.ordenadoPorPrecio) {
			const avisosordenprecio = [];
			console.log(this.avisos, avisosordenprecio, this.ordenPorPrecio);

			console.log('asdfasdf');
			this.avisos.forEach((aviso, i) => {
				if (i === 0) { // si es el primer item, hago un push a mi array ordenado del primer item.
					avisosordenprecio.push(aviso);
				} else { // si en mi array ordenado hay mas de uno entonces tengo que rular.
					avisosordenprecio.forEach((avisoorden, e) => {
						if (e === 0) { // si es el primero
							if (aviso.precio < avisoorden.precio) {
								avisosordenprecio.unshift(aviso);
							}
						} else if ((e > 0) && (e < avisosordenprecio.length)) { // si llegué al último item en mi array ordenado
							if (aviso.precio < avisoorden.precio) {
								avisosordenprecio.splice(e, 0, aviso);
							} 
						} else if (e === avisosordenprecio.length) {
							if (aviso.precio < avisoorden.precio) {
								avisosordenprecio.splice(e, 0, aviso);
							} else {
								avisosordenprecio.push(aviso);
							}
						}

					})

				}

			});
			this.avisos = avisosordenprecio;
			this.ordenadoPorPrecio = true;
			this.ordenPorPrecio = 'ASC';
		}

		if (orden === 'preciomenor') {
			if (this.ordenPorPrecio === 'DESC') {
				this.ordenPorPrecio = 'ASC';
				this.avisos.reverse();
			}
		} else if (orden === 'preciomayor') {
			console.log(this.avisos);
			if (this.ordenPorPrecio === 'ASC') {
				this.ordenPorPrecio = 'DESC';
				this.avisos.reverse();
			}
		}


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
