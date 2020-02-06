import { Component, OnInit, HostListener } from '@angular/core';
import { AvisosService, FormsService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso, Avisos } from 'src/app/models/aviso.model';


@Component({
	selector: 'app-avisos',
	templateUrl: './avisos.component.html',
	styleUrls: ['./avisos.component.scss']
})

export class AvisosComponent implements OnInit {
	private INFINITESCROLL_THRESHOLD = 80;
	private showGoUpButton: boolean;
	private getMoreAvisos = false;
	localidadesActivas: object[]; //viene de un emit del formulario filtros
	showScrollHeight = 400;
	hideScrollHeight = 200;
	avisos: Aviso[];
	constructor(
		private snackBar: MatSnackBar,
		private avisosService: AvisosService
	) {
		this.showGoUpButton = false;
	}

	ngOnInit() {

		this.cambiarTab(Number(localStorage.getItem('viewtab')) || 0);
		this.scrollTop(); // envio el scroll hacia arriba

		if (localStorage.getItem('filtros')) {
			const filtros = JSON.parse(localStorage.getItem('filtros'));
			this.obtenerAvisos(filtros);
		}
	}

	obtenerAvisos(filtros: any) {
		this.avisosService.obtenerAvisos(filtros).then((data: Avisos) => {
			this.avisos = data.avisos;
			const res = `Se obtuvieron ${data.total} avisos`;
			this.snak(res, 2000);
		}).catch((err) => {
			this.avisos = [];
			this.snak(err, 2000);
		});
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

	localidadesSeleccionadas(event:any){
		console.log(event);
	}


	
	avisosChange(e:any){
		console.log('Evento desde list', e); // e contiene los avisos con datos ya modificados.
		// si sólo modifico propiedades o elementos dentro de un array, el ciclo de detección de cambios 
		// en el componente hijo no detecta los cambios porque le estoy pasando el mismo array, para que 
		// el componente hijo pueda detectar que le estoy pasando datos nuevos tengo que pasar un array 
		// NUEVO y para eso uso el operador SPREAD.
		this.avisos = [...e]; 
	}
}
