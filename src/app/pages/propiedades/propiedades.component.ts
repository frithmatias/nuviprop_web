import { Component, OnInit, HostListener } from '@angular/core';
import { PropiedadesService } from 'src/app/services/services.index';

declare function init_plugins();
@Component({
	selector: 'app-propiedades',
	templateUrl: './propiedades.component.html',
	styleUrls: ['./propiedades.component.scss']
})

export class PropiedadesComponent implements OnInit {



	filtrosOperaciones: string[] = [];
	filtrosInmuebles: string[] = [];
	filtrosLocalidades: string[] = [];

	private INFINITESCROLL_THRESHOLD = 80;
	private showGoUpButton: boolean;
	private getMoreProps = false;

	showScrollHeight = 400;
	hideScrollHeight = 200;

	constructor(
		private propiedadesService: PropiedadesService
	) {
		this.showGoUpButton = false;
	}

	ngOnInit() {
		const maparef = document.getElementById('mapbox');
		maparef.setAttribute('style', 'width:100%;');
		init_plugins();
		this.cambiarTab(this.propiedadesService.tabselected);
		this.scrollTop(); // envio el scroll hacia arriba
	}

	tabSelected(n: number) {
		this.propiedadesService.tabselected = n;
	}

	cambiarTab(tab: number) {
		// guardo en el servico el tab seleccionado por última vez, para que al volver de
		// ver una propiedad, quede seleccionado el ultimo tab seleccionado.
		const tabs: any = document.getElementsByClassName('nav-link tabs');
		const contents: any = document.getElementsByClassName('tab-pane');

		// desactivo los tabs
		for (const ref of tabs) {
			ref.classList.remove('active');
		}
		// desactivo los contenidos
		for (const ref of contents) {
			ref.classList.remove('show.active');
		}

		// activo el tab correspondiente al ultimo seleccionado guardado en el servicio.
		tabs[tab].classList.add('active');

		// activo el contenedor correspondiente al tab seleccionado.
		contents[tab].classList.add('show', 'active');
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
		const contentHeight = document.getElementById('myTabContent').offsetHeight;
		if (((document.documentElement.scrollTop + document.documentElement.clientHeight) * 100 / contentHeight) > this.INFINITESCROLL_THRESHOLD) {
			if (this.getMoreProps === false) {
				this.propiedadesService.cargarPropiedades(0);
			}
			this.getMoreProps = true;
		} else {
			this.getMoreProps = false;
		}
	}

	filterSelected(event) {
		// en event me llega del componente hijo, un objeto que contiene un array de objetos, 
		// un array por cada filtro y dentro del array, un objeto por cada check con nombre y _id.

		console.log('al componente padre llego: ', event)
		this.filtrosOperaciones = event.tipooperacion;
		this.filtrosInmuebles = event.tipoinmueble;
		this.filtrosLocalidades = event.localidad;

	}

}
