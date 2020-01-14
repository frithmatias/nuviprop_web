import { Injectable, ViewChild, ElementRef, Input } from '@angular/core';
import { MAPBOX_TOKEN } from '../../config/config';
import { PuntosMapa } from 'src/app/models/puntosmapa.model';

declare var mapboxgl: any;

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  coords = '-34.584335,-58.4593311';
  misPuntosMapa: PuntosMapa[];


  constructor() { }

  inicializarMapa(mapbox) {
    const latLng = this.coords.split(',');
    const lat = Number(latLng[0]);
    const lng = Number(latLng[1]);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      // container: 'mapa',
      container: mapbox.nativeElement,
      // como yo voy a mostrar el mapa en varios lados, no puedo enviarle siempre el mismo id, por eso
      // le envío todo el contenedor para decirle a angular en que contenedor lo tiene que mostrar
      logoPosition: 'top-left',
      // container: this.mapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 15
    });

    // Soluciona el problema del tamaño del mapa en un nav-tabs de bootstrap
    map.on('load', () => {
      $('[data-toggle="tab"]').on('shown.bs.tab', () => {
        map.resize();
      });
    });

  }
}
