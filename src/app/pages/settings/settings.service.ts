import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class SettingsService {

	ajustes: Ajustes = {
		temaUrl: 'assets/css/colors/default.css',
		tema: 'default'
	};

	constructor(@Inject(DOCUMENT) private _document) {
		this.cargarAjustes();
	}

	guardarAjustes() {
		localStorage.setItem('tema', JSON.stringify(this.ajustes));
	}

	cargarAjustes() {

		if (localStorage.getItem('tema')) {
			this.ajustes = JSON.parse(localStorage.getItem('tema'));
			this.aplicarTema(this.ajustes.tema);
		} else {
			this.aplicarTema(this.ajustes.tema);
		}

	}

	aplicarTema(tema: string) {

		// INDEX.HTML
		// <link href="assets/css/colors/default-dark.css" id="tema" rel="stylesheet"/>

		const url = `assets/css/colors/${tema}.css`;
		this._document.getElementById('tema').setAttribute('href', url);

		this.ajustes.tema = tema;
		this.ajustes.temaUrl = url;

		this.guardarAjustes();

	}

}

interface Ajustes {
	temaUrl: string;
	tema: string;
}
