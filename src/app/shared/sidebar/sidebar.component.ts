import { Component, OnInit } from '@angular/core';
import {
  UsuarioService, SidebarService
} from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';
// declare function init_plugins();
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  constructor(
    private userService: UsuarioService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    // init_plugins();

    if (this.userService.logueado) {
      this.usuario = this.userService.usuario;
    }
  }
}
