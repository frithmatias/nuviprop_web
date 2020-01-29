import { Component, OnInit, ViewChild, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MAPBOX_TOKEN } from "../../config/config";

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
	mymarker: any;
	markerInserted = false; // en crear aviso, es necesario crear solo un marker
	@Output() newMarker: EventEmitter<{}> = new EventEmitter();

	constructor() { }

	ngOnInit() {
		this.inicializarMapa(this.mapbox);
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
		if (changes.center) {
			this.flyMap(changes.center.currentValue);
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
				console.log(e.lngLat.wrap());
				this.markerInserted = true;
				this.mymarker = new mapboxgl.Marker({ draggable: true })
					.setLngLat(e.lngLat.wrap())
					.addTo(this.map);
					this.newMarker.emit(e.lngLat.wrap());
					// Declaro el evento dragend sólo una vez, cuando inicializo mi marker.
					this.mymarker.on("dragend", m => {
						// Al mover el marker haciendo DRAG
						this.newMarker.emit( this.mymarker.getLngLat());
						console.log('on drag:', this.mymarker.getLngLat());
					});

			} else {
				console.log('on click:', e.lngLat.wrap());
				this.mymarker.setLngLat(e.lngLat.wrap());
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
		if (this.mymarker) this.mymarker.remove();
		if (this.map) this.map.flyTo({ center });
	}
}
