import { Component, OnInit, HostListener } from '@angular/core';
import { AvisosService, FormsService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso } from 'src/app/models/aviso.model';

declare function init_plugins();
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
		const maparef = document.getElementById('mapbox');
		maparef.setAttribute('style', 'width:100%;');
		init_plugins();
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

	obtenerAvisos(filtros: any) {
		this.avisosService.obtenerAvisos(filtros).then((res: string) => {
			this.avisos = this.avisosService.avisos;
			this.snak(res, 2000);
		}).catch((err) => {
			this.snak(err, 2000);
		});
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
		console.log('Evento desde list', e);
		this.avisos = e;
	}
}
