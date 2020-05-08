import { Injectable, ɵConsole } from '@angular/core';

interface Files {
	name: string;
	insertinto: string;
	element: string;
	type: string;
	src: string;
}

@Injectable({
	providedIn: 'root'
})

export class LoadScriptsService {
	css: Files[] = [
	];
	scripts: Files[] = [
		// CSSs
		// { name: 'fotorama', insertinto: 'head', element: 'link', type: 'text/css', src: 'assets/plugins/fotorama/fotorama.dev.css' },

		// SCRIPTS
		// { name: 'jquery', src: '../assets/plugins/jquery/jquery.min.js' },
		{ name: 'popper', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/plugins/bootstrap/js/popper.min.js' },
		{ name: 'scrollbar', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/js/perfect-scrollbar.jquery.min.js' },
		{ name: 'hammer', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/plugins/hammer/hammer.min.js' },
		{ name: 'bootstrap', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/plugins/bootstrap/js/bootstrap.min.js' },
		{ name: 'waves', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/js/waves.js' },
		{ name: 'fotorama', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/plugins/fotorama/fotorama.dev.js' },
		{ name: 'custom', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/js/custom.js' },
		{ name: 'sidebar', insertinto: 'body', element: 'script', type: 'text/javascript', src: 'assets/js/sidebarmenu.js' },
	];

	constructor() {
	}

	public async loadScripts() {
		// Cargar FOTORAMA con Vanilla js
		// const myscript = document.createElement('script');
		// myscript.type = 'text/javascript';
		// myscript.src = 'assets/plugins/fotorama/fotorama.dev.js';
		// document.getElementsByTagName('body')[0].appendChild(myscript);

		// LOAD CSSs
		// this.css.forEach(css => {
		// 	console.log('loading ', css.name);
		// 	$('<link>')
		// 		.appendTo('head')
		// 		.attr({
		// 			type: 'text/css',
		// 			rel: 'stylesheet',
		// 			href: css.src
		// 		});
		// })

		// LOAD SCRIPTS
		const myscriptcss: any = document.createElement('link');
		myscriptcss.rel = 'stylesheet';
		myscriptcss.src = 'assets/plugins/fotorama/fotorama.dev.css';
		document.getElementsByTagName('head')[0].appendChild(myscriptcss);

		for (const script of this.scripts) {
			// this.scripts.forEach(async script => {
			console.log('loading ', script.type, script.name, '...');
			await this.loadScript(script).then(data => {
				console.log('loading ', script.name, data);
			}).catch(err => {
				console.log('Falló la carga del script:', err);
			});
		}
	}

	private loadScript(script: Files) {
		return new Promise((resolve, reject) => {
			const myscript: any = document.createElement(script.element);
			myscript.type = script.type;
			myscript.src = script.src;
			document.getElementsByTagName(script.insertinto)[0].appendChild(myscript);
			resolve('success');
		});
	}

}