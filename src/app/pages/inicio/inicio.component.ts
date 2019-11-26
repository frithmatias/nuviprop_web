import { Component, OnInit, ViewChild } from '@angular/core';
declare var mapboxgl: any;
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  @ViewChild('mapa', { static: true })
  mapa: any;
  coords = '-34.584335,-58.4593311';
  constructor() { }

  ngOnInit() {

    const latLng = this.coords.split(',');
    const lat = Number(latLng[0]);
    const lng = Number(latLng[1]);

    console.log(this.coords);
    mapboxgl.accessToken =
      'pk.eyJ1IjoiY29kZXI0MDQiLCJhIjoiY2sxMnBkMnl1MDA4cDNvcDFxanV4cThzZSJ9.qHR4JrSJ0aqpIG8VVRUTLw';
    const map = new mapboxgl.Map({
      container: 'mapa',
      // container: this.mapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 15
    });
    const marker1 = new mapboxgl.Marker().setLngLat([-58.4584311, -34.586335]).addTo(map);
    const marker22 = new mapboxgl.Marker().setLngLat([-58.4594311, -34.581335]).addTo(map);

  }

}
