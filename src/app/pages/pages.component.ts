import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/services.index';

declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {
  setclass = true;

  constructor(private usuarioService: UsuarioService) {

  }

  ngOnInit() {
    init_plugins();
  }

}
