import { Component, OnInit, ViewChild } from '@angular/core';
import { MAPBOX_TOKEN } from '../../config/config';
import { PuntosMapa } from 'src/app/models/puntosmapa.model';

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

  misPuntosMapa: PuntosMapa[];
  ngOnInit() {

    const latLng = this.coords.split(',');
    const lat = Number(latLng[0]);
    const lng = Number(latLng[1]);

    console.log(this.coords);
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'mapa',
      logoPosition: 'top-left',
      // container: this.mapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12
    });
    const marker1 = new mapboxgl.Marker().setLngLat([-58.4584311, -34.586335]).addTo(map);
    const marker22 = new mapboxgl.Marker().setLngLat([-58.4594311, -34.581335]).addTo(map);


    map.on('load', () => {
      // Add a layer showing the places.

      map.addLayer({
        id: 'places',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{}] // Aca inyecto mi objeto con los puntos en el mapa
          }
        },
        layout: {
          'icon-image': '{icon}-15',
          'icon-allow-overlap': true
        }
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.on('click', 'places', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'places', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
      });

      // Selección del tema del mapa, light, dark, setelite, etc
      const layerList = document.getElementById('menu');
      const inputs = layerList.getElementsByTagName('input');

      function switchLayer(layer) {
        console.log(layer);
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
      }

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
      }

    });


  }

}
