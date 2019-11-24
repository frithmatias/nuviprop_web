import { Injectable } from '@angular/core';
import { UsuarioService } from 'src/app/services/services.index';

@Injectable()
export class SidebarService {
  // menu: any[] = [];
  // menu: any = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Dashboard', url: '/dashboard' },
  //       { titulo: 'ProgressBar', url: '/progress' },
  //       { titulo: 'Usuarios', url: '/usuarios' },
  //       { titulo: 'Propiedades', url: '/propiedades' },
  //       { titulo: 'Inmobiliarias', url: '/inmobiliarias' }
  //     ]
  //   }
  // ];

  constructor() {
    // this.menu = this.usuarioService.menu;
    // console.log('MENU', this.menu);
    // Si falla al cargar el menu tengo que llamar al metodo cargarMenu() desde el componente SIDEBAR
    // SIDEBAR.COMPONENT.TS:
    // ngOnInit(); {
    //   this.usuario = this.usuarioService.usuario;
    // ->   this.sideBar.cargarMenu();
    // }
  }


}
