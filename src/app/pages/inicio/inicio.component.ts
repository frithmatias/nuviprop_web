import { Component, OnInit, ViewChild } from '@angular/core';
import { PropiedadesService, InicioService, MapaService } from 'src/app/services/services.index';
import { Propiedad } from 'src/app/models/propiedad.model';

declare function init_plugins();
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})


export class InicioComponent implements OnInit {
  propiedades: Propiedad[] = [];

  constructor(
    private inicioService: InicioService,
    private propiedadesService: PropiedadesService,
    private mapaService: MapaService) { }

  ngOnInit() {
    init_plugins();
    // '-34.584335,-58.4593311'
    this.propiedadesService.cargarPropiedades().subscribe(data => {
      this.propiedades = data.propiedades;
    });
    this.cambiarTab(this.inicioService.tabselected);
  }

  cambiarTab(tab: number) {
    const tabs: any = document.getElementsByClassName('nav-link tabs');
    const contents: any = document.getElementsByClassName('tab-pane');
    for (const ref of tabs) {
      ref.classList.remove('active');
    }
    for (const ref of contents) {
      ref.classList.remove('show.active');
    }
    tabs[tab].classList.add('active');
    contents[tab].classList.add('show', 'active');
  }


}
