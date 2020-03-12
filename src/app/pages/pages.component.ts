import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/services.index';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {
  constructor(private usuarioService: UsuarioService) {
  }
  ngOnInit() {
  }
}
