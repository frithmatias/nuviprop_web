import { Component, Inject, OnInit } from '@angular/core';
import { SettingsService } from '../../services/services.index';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {
  constructor(public _ajustes: SettingsService) { }

  ngOnInit() {
    this.colocarCheck();
  }

  cambiarColor(tema: string, link: any) {
    this.aplicarCheck(link);
    this._ajustes.aplicarTema(tema);
  }

  // cuando selecciono un tema aplico el tilde
  aplicarCheck(link: any) {
    const selectores: any = document.getElementsByClassName('selector');
    for (const ref of selectores) {
      ref.classList.remove('working');
    }
    link.classList.add('working');
  }

  // cuando entro en la pagina account-settings aplico el tilde en el tema que esta seleccionado
  colocarCheck() {
    const selectores: any = document.getElementsByClassName('selector');
    const tema = this._ajustes.ajustes.tema;
    for (const ref of selectores) {
      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
        break;
      }
    }
  }
}
