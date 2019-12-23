import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/services.index';
import { Observable, Observer } from 'rxjs';

declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {
  setclass = true;
  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
  }

}
