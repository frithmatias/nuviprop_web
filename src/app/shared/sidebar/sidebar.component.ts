import { Component, OnInit } from '@angular/core';
import {
	UsuarioService, SidebarService
} from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styles: []
})
export class SidebarComponent implements OnInit {
	usuario: Usuario;
	constructor(
		public userService: UsuarioService,
		public sidebarService: SidebarService
	) { }

	ngOnInit() {

		if (this.userService.logueado) {
			this.usuario = this.userService.usuario;
		}
	}
}
