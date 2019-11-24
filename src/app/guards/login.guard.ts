import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UsuarioService } from '../pages/usuarios/usuarios.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivate() {

    if (this.usuarioService.estaLogueado()) {
      return true;
    } else {
      console.log('Bloqueado por guard');
      this.router.navigate(['/login']);
      return false;
    }

  }
}
