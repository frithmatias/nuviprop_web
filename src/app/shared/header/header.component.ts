import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService, UsuarioService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  publicmenu: any[];

  constructor(
    private router: Router,
    private userService: UsuarioService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.publicmenu = this.sidebarService.publicHeaderMenu;
  }

  buscar(termino: string) {
    this.router.navigate(['/buscar', termino]);
  }
}
