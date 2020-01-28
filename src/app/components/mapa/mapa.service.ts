import { Injectable } from "@angular/core";
import { MAPBOX_TOKEN } from "../../config/config";
declare var mapboxgl: any;

@Injectable({
  providedIn: "root"
})
export class MapaService {
  map: any;
  mapCenterInit = { lng: "-58.43680066430767", lat: "-34.608870104837614" };
  mapZoom = 12;
  mymarker: any;
  markerInserted = false; // en crear aviso, es necesario crear solo un marker

  constructor() {}

  inicializarMapa(mapbox) {
	const lat = Number(this.mapCenterInit.lat);
	const lng = Number(this.mapCenterInit.lng);

	mapboxgl.accessToken = MAPBOX_TOKEN;

	this.map = new mapboxgl.Map({
	  // container: 'mapa',
	  container: mapbox.nativeElement,
	  // como yo voy a mostrar el mapa en varios lados, no puedo enviarle siempre el mismo id, por eso
	  // le envío todo el contenedor para decirle a angular en que contenedor lo tiene que mostrar
	  // logoPosition: "top-left",
	  style: "mapbox://styles/mapbox/streets-v11",
	  center: [lng, lat],
	  zoom: this.mapZoom
	});

	var nav = new mapboxgl.NavigationControl();
	this.map.addControl(nav, "top-left");

	this.map.on("click", e => {
	  if (!this.markerInserted) {
		this.markerInserted = true;
		this.mymarker = new mapboxgl.Marker({ draggable: true })
		  .setLngLat(e.lngLat.wrap())
		  .addTo(this.map);
		this.mymarker.on("dragend", m => {
		  console.log(this.mymarker.getLngLat());
		});
	  } else {
		  this.mymarker.setLngLat(e.lngLat.wrap());
	  }

	});

	// Soluciona el problema del tamaño del mapa en un nav-tabs de bootstrap
	this.map.on("load", () => {
		this.map.resize();
	//   $('[data-toggle="tab"]').on("shown.bs.tab", () => {
	// 	this.map.resize();
	//   });
	});
  }

  flyMap(center) {
	this.markerInserted = false;
	if (this.mymarker) this.mymarker.remove();
	this.map.flyTo({ center });
  }
}
