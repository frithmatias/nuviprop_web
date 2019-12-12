import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PuntosMapa } from '../../models/puntosmapa.model';
import { MAPBOX_TOKEN } from '../../config/config';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  @ViewChild('mapbox', { static: true }) mapbox;

  coords = '-34.584335,-58.4593311';
  misPuntosMapa: PuntosMapa[];

  constructor() { }

  ngOnInit() {
    this.inicializarMapa();
  }
  inicializarMapa() {


    console.log('mapbox: ', this.mapbox);

    const latLng = this.coords.split(',');
    const lat = Number(latLng[0]);
    const lng = Number(latLng[1]);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      // container: 'mapa',
      container: this.mapbox.nativeElement,
      // como yo voy a mostrar el mapa en varios lados, no puedo enviarle siempre el mismo id, por eso
      // le envío todo el contenedor para decirle a angular en que contenedor lo tiene que mostrar
      logoPosition: 'top-left',
      // container: this.mapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 15
    });
  }


}
