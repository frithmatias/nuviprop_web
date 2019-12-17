import { Component, OnInit } from '@angular/core';
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

}
