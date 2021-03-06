import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from '../services/usuarios.service';

@Injectable()
export class LoginGuard implements CanActivate {

	constructor(
		public usuarioService: UsuarioService,
		public router: Router
	) { }

	canActivate() {

		if (this.usuarioService.logueado) {
			return true;
		} else {
			this.router.navigate(['/login']);
			return false;
		}

	}
}
