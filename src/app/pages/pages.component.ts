import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from '../services/services.index';
import { LoadScriptsService } from '../services/loadscripts.service';
// declare function init_custom();
// declare function init_sidebar();

@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html',
	styles: []
})
export class PagesComponent implements OnInit, AfterViewInit {
	constructor(
		private usuarioService: UsuarioService,
		private loadScripts: LoadScriptsService
	) {
	}
	ngAfterViewInit() {
		// this.loadScripts.loadScripts();
	}
	ngOnInit() {
		// init_custom();
		// init_sidebar();

		this.loadScripts.loadScripts();

		// $.getScript('assets/plugins/jquery/jquery.min.js');
		// $.getScript('assets/js/custom.js');
		// $.getScript('assets/js/sidebarmenu.js');
		// $.getScript('assets/js/perfect-scrollbar.jquery.min.js');
		// $.getScript('assets/js/waves.js');
		// $.getScript('assets/plugins/fotorama/fotorama.dev.js');
		// $.getScript('assets/plugins/bootstrap/js/popper.min.js');
		// $.getScript('assets/plugins/bootstrap/js/bootstrap.min.js');
		// $.getScript('assets/plugins/hammer/hammer.min.js');


	}
}
