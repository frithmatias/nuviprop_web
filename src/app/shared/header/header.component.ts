import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService, UsuarioService, SettingsService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	usuario: Usuario;
	publicmenu: any[];

	constructor(
		private router: Router,
		public userService: UsuarioService,
		public sidebarService: SidebarService,
		public _ajustes: SettingsService
	) { }

	ngOnInit() {
		this.colocarCheck();
		this.publicmenu = this.sidebarService.publicHeaderMenu;
	}

	buscar(termino: string) {
		this.router.navigate(['/buscar', termino]);
	}


	// THEME METHODS 
	cambiarColor(tema: string, link: any) {
		this.aplicarCheck(link);
		this._ajustes.aplicarTema(tema);
	}

	// cuando selecciono un tema aplico el tilde
	aplicarCheck(link: any) {
		const selectores: any = document.getElementsByClassName('selector');
		for (const ref of selectores) {
			ref.classList.remove('working');
		}
		link.classList.add('working');
	}

	// cuando entro en la pagina account-settings aplico el tilde en el tema que esta seleccionado
	colocarCheck() {
		const selectores: any = document.getElementsByClassName('selector');
		const tema = this._ajustes.ajustes.tema;
		for (const ref of selectores) {
			if (ref.getAttribute('data-theme') === tema) {
				ref.classList.add('working');
				break;
			}
		}
	}
}
