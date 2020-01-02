import { Injectable } from '@angular/core';
import { UsuarioService } from 'src/app/services/services.index';

@Injectable()
export class SidebarService {

	// HEADER
	publicHeaderMenu = [
		{ icono: 'mdi mdi-home', titulo: 'Inicio', url: '/inicio', class: 'nav-item' },
		{ icono: 'mdi mdi-home-modern', titulo: 'Propiedades', url: '/propiedades', class: 'nav-item d-none d-sm-block' },
		{ icono: 'mdi mdi-cash-usd', titulo: 'Tasaciones', url: '/tasaciones', class: 'nav-item d-none d-md-block' },
		{ icono: 'mdi mdi-city', titulo: 'Emprendimientos', url: '/emprendimientos', class: 'nav-item d-none d-lg-block' },
		{ icono: 'mdi mdi-account-card-details', titulo: 'Nosotros', url: '/nosotros', class: 'nav-item d-none d-xl-block' },
		{ icono: 'mdi mdi-email', titulo: 'Contacto', url: '/contacto', class: 'nav-item d-none d-sm-block' }
	];

	constructor() { }


}
