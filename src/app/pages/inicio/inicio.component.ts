import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { InicioService, MapaService } from 'src/app/services/services.index';

declare function init_plugins();
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})


export class InicioComponent implements OnInit {
  private INFINITESCROLL_THRESHOLD = 90;
  private showGoUpButton: boolean;
  private getMoreProps = false;
  showScrollHeight = 400;
  hideScrollHeight = 200;
  constructor(
    private inicioService: InicioService, private mapaService: MapaService) {
    this.showGoUpButton = false;
  }

  ngOnInit() {
    console.log('NGONINIT');
    const maparef = document.getElementById('mapbox');
    maparef.setAttribute('style', 'width:100%;');

    this.cambiarTab(this.inicioService.tabselected);
    this.scrollTop(); // envio el scroll hacia arriba
    init_plugins();
  }

  tabSelected(n: number) {
    this.inicioService.tabselected = n;
  }

  cambiarTab(tab: number) {
    // guardo en el servico el tab seleccionado por última vez, para que al volver de
    // ver una propiedad, quede seleccionado el ultimo tab seleccionado.
    const tabs: any = document.getElementsByClassName('nav-link tabs');
    const contents: any = document.getElementsByClassName('tab-pane');

    // desactivo los tabs
    for (const ref of tabs) {
      ref.classList.remove('active');
    }
    // desactivo los contenidos
    for (const ref of contents) {
      ref.classList.remove('show.active');
    }

    // activo el tab correspondiente al ultimo seleccionado guardado en el servicio.
    tabs[tab].classList.add('active');

    // activo el contenedor correspondiente al tab seleccionado.
    contents[tab].classList.add('show', 'active');
  }


  scrollTop() {
    console.log('enviando hacia arriba');
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {

    if ((window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if (this.showGoUpButton &&
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop)
      < this.hideScrollHeight) {
      this.showGoUpButton = false;
    }

    // 1. document.documentElement.scrollTop, posicion absoulta de cota superior de scroll
    // 2. document.documentElement.clientHeight, altura del scroll
    // 3. document.documentElement.offsetHeight, altura total de la ventana
    // 1 + 2 = 3

    if (((document.documentElement.scrollTop + document.documentElement.clientHeight) * 100 / document.documentElement.offsetHeight) > this.INFINITESCROLL_THRESHOLD) {
      if (this.getMoreProps === false) {
        this.inicioService.cargarPropiedades();
      }
      this.getMoreProps = true;
    } else {
      this.getMoreProps = false;
    }
  }

  getMore() {
    console.log('GET MORE PROPS');
  }
}
