import { Component, OnInit, ViewChild, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MAPBOX_TOKEN } from "../../config/config";
import { Router } from '@angular/router';

declare var mapboxgl: any;
@Component({
	selector: 'app-mapa',
	templateUrl: './mapa.component.html',
	styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
	@ViewChild('mapbox', { static: true }) mapbox;
	@Input() avisos: Aviso[] = [];
	@Input() center: string[] = [];
	map: any;
	mapCenterInit = { lng: "-58.43680066430767", lat: "-34.608870104837614" };
	mapZoom = 14;
	markersAvisos: any[] = [];
	markerNuevoAviso: any;
	markerInserted = false; // en crear aviso, es necesario crear solo un marker
	@Output() newMarker: EventEmitter<{}> = new EventEmitter();

	constructor(private router: Router) { }

	ngOnInit() {
		this.inicializarMapa(this.mapbox);
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
		if (changes.center) {
			this.flyMap(changes.center.currentValue);
		}

		// Escucho los cambios en AVISOS para crear mi array de puntos en el mapa.
		if(changes.avisos && changes.avisos.currentValue.length > 0){
			if(this.router.url === '/avisos'){ // solo si estoy en la page AVISOS 
			this.avisos.forEach((aviso: any) => {
				if(aviso.coords){ // solo si tiene coordenadas
					this.markersAvisos.push(aviso);
					let newmarker = new mapboxgl.Marker({draggable: false}).setLngLat(aviso.coords).addTo(this.map);
				}
			})
		}
			console.log(this.markersAvisos);
		}

	}

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
		this.map.addControl(nav, "top-right");

		this.map.on("click", e => {
			if (!this.markerInserted) {
				this.markerInserted = true;
				this.markerNuevoAviso = new mapboxgl.Marker({ draggable: true })
					.setLngLat(e.lngLat.wrap())
					.addTo(this.map);
					console.log(e.lngLat.wrap());
					this.newMarker.emit(e.lngLat.wrap());
					// Declaro el evento dragend sólo una vez, cuando inicializo mi marker.
					this.markerNuevoAviso.on("dragend", m => {
						// Al mover el marker haciendo DRAG
						this.newMarker.emit( this.markerNuevoAviso.getLngLat());
					});

			} else {
				this.markerNuevoAviso.setLngLat(e.lngLat.wrap());
				this.newMarker.emit(e.lngLat.wrap());
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
		if (this.markerNuevoAviso) this.markerNuevoAviso.remove();
		if (this.map) this.map.flyTo({ center });
	}
}
