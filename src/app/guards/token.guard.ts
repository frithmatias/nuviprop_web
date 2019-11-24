import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../pages/usuarios/usuarios.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenGuard implements CanActivate {

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  // verifica primero si expiro el token, si expiro devuelve false y lo manda al login
  // si no expiro verifica si tiene que renovar (es cuando defino un tiempo proximo a vencer)
  // si tiene que renovar devuelve true y sino, devuelve false.
  canActivate(): Promise<boolean> | boolean {
    console.log('Token guard');
    const token = this.usuarioService.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirado = this.expirado(payload.exp);
    console.log('Verificando si el token expiro...');
    if (expirado) {
      console.log('El token expiro, se despacha al login.');
      this.router.navigate(['/login']);
      return false;
    }
    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tokenExp = new Date(fechaExp * 1000);
      const ahora = new Date();
      const renueva = new Date();
      renueva.setTime(ahora.getTime() + (1 * 60 * 60 * 1000));
      console.log('El token no expiro, verificando si debe renovar...');
      console.log('Hora de expiración del token: ', tokenExp);
      console.log('Se renueva el token 1 hora o 3600 segundos antes de expirar');
      const difRenueva = tokenExp.getTime() - renueva.getTime();
      const difExpira = tokenExp.getTime() - ahora.getTime();

      if (tokenExp.getTime() > ahora.getTime()) {
        // si falta mas de una hora (definida en 'ahora + 3600') No es necesario renovar
        console.log('No se necesita renovar');
        console.log('Para la renovación: ', difRenueva / 1000 + 'segundos');
        console.log('Para la expiracion: ', difExpira / 1000 + 'segundos');

        resolve(true);
      } else {
        console.log('Se necesita renovar el token!', difRenueva);
        this.usuarioService.renuevaToken()
          .subscribe(() => {
            console.log('Se renovó exitosamente el token!.');
            resolve(true);
          }, () => {
            console.log('Error en la renovación del token, se despacha al login.');
            this.router.navigate(['/login']);
            reject(false);
          });
      }
    });
  }

  expirado(fechaExp: number) {
    const ahora = new Date().getTime() / 1000;
    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
