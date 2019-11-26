import { Injectable } from '@angular/core';
import { UsuarioService } from 'src/app/services/services.index';

@Injectable()
export class SidebarService {

  publicSidebarMenu = [{
    titulo: 'Menu',
    icono: 'mdi mdi-menu',
    submenu: [
      { titulo: 'Inicio', url: '/inicio' },
      { titulo: 'Buscar propiedades', url: '/filtrosaplicados' },
      { titulo: 'Filtros', url: '/filtros' },
      { titulo: 'Emprendimientos', url: '/emprendimientos' },
      { titulo: 'Tasaciones', url: '/tasaciones' },
      { titulo: 'Nosotros', url: '/nosotros' },
      { titulo: 'Contacto', url: '/tasaciones' }
    ]
  },
  {
    titulo: 'Filtros',
    icono: 'mdi mdi-tune',
    submenu: [
      { titulo: 'precio', valor: 200 }
    ]

  }
  ];

  publicHeaderMenu = [
    { titulo: 'Inicio', url: '/inicio' },
    { titulo: 'Buscar propiedades', url: '/filtrosaplicados' },
    { titulo: 'Filtros', url: '/filtros' },
    { titulo: 'Emprendimientos', url: '/emprendimientos' },
    { titulo: 'Tasaciones', url: '/tasaciones' },
    { titulo: 'Nosotros', url: '/nosotros' },
    { titulo: 'Contacto', url: '/tasaciones' }
  ];

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
