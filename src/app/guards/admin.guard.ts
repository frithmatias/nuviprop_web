import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../pages/usuarios/usuarios.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService
  ) { }

  canActivate() {

    if (this.usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this.usuarioService.logout();
      return false;
    }

  }

}
