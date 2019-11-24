import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/services.index';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  constructor(private userService: UsuarioService, private router: Router) { }

  ngOnInit() {
    this.usuario = this.userService.usuario;
  }
  buscar(termino: string) {
    this.router.navigate(['/buscar', termino]);
  }
}
