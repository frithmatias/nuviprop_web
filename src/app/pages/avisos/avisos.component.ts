import { Component, OnInit, HostListener } from '@angular/core';
import { AvisosService, FormsService } from 'src/app/services/services.index';

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

	showScrollHeight = 400;
	hideScrollHeight = 200;

	constructor(
		private avisosService: AvisosService
	) {
		this.showGoUpButton = false;
	}

	ngOnInit() {
		const maparef = document.getElementById('mapbox');
		maparef.setAttribute('style', 'width:100%;');
		init_plugins();
		this.cambiarTab(Number(localStorage.getItem('viewtab')) || 0);
		this.scrollTop(); // envio el scroll hacia arriba
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
				break
		}

		// activo el contenedor correspondiente al tab seleccionado.
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

			// al hacer un scroll hacia abajo, el boton que aparece para ir hacia arriba tapa el footer.
			// corro el telefono hacia la izquierda para que no lo tape.
			this.showGoUpButton = true;
		} else if (this.showGoUpButton &&
			(window.pageYOffset ||
				document.documentElement.scrollTop ||
				document.body.scrollTop)
			< this.hideScrollHeight) {
			this.showGoUpButton = false;
		}

		// 1. document.documentElement.scrollTop, posicion absoulta de cota superior de scroll
		// 2. document.documentElement.clientHeight, altura del scroll
		// 3. document.documentElement.offsetHeight, altura total de la ventana
		// 1 + 2 = 3
		// const contentHeight = document.getElementById('myTabContent').offsetHeight;
		// if (((document.documentElement.scrollTop + document.documentElement.clientHeight) * 100 / contentHeight) > this.INFINITESCROLL_THRESHOLD) {
		// 	if (this.getMoreAvisos === false) {
		// 		this.avisosService.obtenerAvisos();
		// 	}
		// 	this.getMoreAvisos = true;
		// } else {
		// 	this.getMoreAvisos = false;
		// }
	}

	filterSelected(filtros: any) {
		this.avisosService.obtenerAvisos(filtros);
	}

}
