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
    { icono: 'mdi mdi-home', titulo: 'Inicio', url: '/inicio', class: 'nav-item' },
    { icono: 'mdi mdi-home-modern', titulo: 'Propiedades', url: '/propiedades', class: 'nav-item d-none d-sm-block' },
    { icono: 'mdi mdi-cash-usd', titulo: 'Tasaciones', url: '/tasaciones', class: 'nav-item d-none d-md-block' },
    { icono: 'mdi mdi-city', titulo: 'Emprendimientos', url: '/emprendimientos', class: 'nav-item d-none d-lg-block' },
    { icono: 'mdi mdi-account-card-details', titulo: 'Nosotros', url: '/nosotros', class: 'nav-item d-none d-xl-block' },
    { icono: 'mdi mdi-email', titulo: 'Contacto', url: '/contacto', class: 'nav-item' }
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
