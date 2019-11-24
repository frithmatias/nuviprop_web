import { Component, OnInit } from '@angular/core';
import {
  UsuarioService
} from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  usermenu: any[] = [];

  constructor(
    private userService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuario = this.userService.usuario;
    this.usermenu = this.userService.menu;
  }

}
