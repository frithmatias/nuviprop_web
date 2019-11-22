import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  constructor(private userService: UsuarioService) {}

  ngOnInit() {
    this.usuario = this.userService.usuario;
    console.log(this.usuario);
  }
}
