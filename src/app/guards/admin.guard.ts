import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../services/usuarios.service';

@Injectable()
export class AdminGuard implements CanActivate {

	constructor(
		public usuarioService: UsuarioService
	) { }

	canActivate() {

		if (this.usuarioService.usuario.role === 'ADMIN_ROLE') {
			return true;
		} else {
			this.usuarioService.logout();
			return false;
		}

	}

}
