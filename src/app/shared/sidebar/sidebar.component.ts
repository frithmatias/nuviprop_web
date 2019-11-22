import { Component, OnInit } from '@angular/core';
import {
  SidebarService,
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
  constructor(
    public sideBar: SidebarService,
    private userService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuario = this.userService.usuario;
  }
}
