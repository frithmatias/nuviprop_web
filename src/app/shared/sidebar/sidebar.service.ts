import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {
  menu: any = [
    {
      titulo: 'Principal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/progress' },
        { titulo: 'Usuarios', url: '/usuarios' },
        { titulo: 'Propiedades', url: '/propiedades' },
        { titulo: 'Inmobiliarias', url: '/inmobiliarias' }
      ]
    }
  ];

  constructor() {}
}
