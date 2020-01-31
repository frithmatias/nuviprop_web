import { Component, OnInit, ViewChild, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MAPBOX_TOKEN } from "../../config/config";
import { Router } from '@angular/router';
import { FormsService } from '../forms/forms.service';

declare var mapboxgl: any;
@Component({
	selector: 'app-mapa',
	templateUrl: './mapa.component.html',
	styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
	@ViewChild('mapbox', { static: true }) mapbox;
	@Input() avisos: Aviso[] = [];
	@Input() center: string[] = []; // center definido en el formulario aviso-crear 
	@Input() centerLocalidades: object[] = []; // center definido en el formulario filtros (checks localidades)
	map: any;
	mapCenterInit = { lng: "-58.43680066430767", lat: "-34.608870104837614" };
	mapZoom = 14;
	markersPoints: any[] = [];
	markerNuevoAviso: any;
	markerInserted = false; // en crear aviso, es necesario crear solo un marker
	@Output() newMarker: EventEmitter<{}> = new EventEmitter();

	constructor(private router: Router, private formsService: FormsService) { }

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
		if (!this.map) this.inicializarMapa(this.mapbox);
		// FORM AVISO-CREAR AL HACER CLICK EN EL CONTROL LOCALIDAD 
		if (changes.center) {
			// Defino la posicion en el mapa dada por el formulario aviso-crear
			this.flyMap(changes.center.currentValue);
		}

		// FORM FILTROS AL HACER CLICK EN UN CHECK DE LOCALIDAD
		if ((typeof changes.centerLocalidades !== 'undefined' && (typeof changes.centerLocalidades.currentValue !== 'undefined') && (typeof changes.centerLocalidades.currentValue[0] !== 'undefined'))) {
			this.flyMap(changes.centerLocalidades.currentValue[0].geometry.coordinates);
		}

		// si 'center' y 'centerLocalidades' estan undefined, entonces vengo del formulario INICIO y tengo que 
		// levantar la Localidad ingresada y guardada en forms.service.ts -> localidadInicio.
		// if (changes.centerLocalidades === undefined) {
		// 	console.log('HOLAAAAA');
		// 	JSON.parse(localStorage.getItem('localidades')).forEach((localidad: any) => {
		// 		if (localidad.current) {
		// 			this.flyMap(localidad.geometry.coordinates)
		// 		}
		// 	})
		// }





		// Escucho los cambios en AVISOS para crear mi array de puntos en el mapa.
		if ((changes.avisos !== undefined) && (changes.avisos.currentValue !== undefined) && changes.avisos.currentValue.length > 0) {
			if (this.router.url === '/avisos') { // solo si estoy en la page AVISOS voy a crear los puntos en el mapa
				this.avisos.forEach((aviso: any) => {
					if (aviso.coords && this.map) { // solo si tiene coordenadas
						let newmarker = new mapboxgl.Marker({ draggable: false }).setLngLat(aviso.coords).addTo(this.map);
						this.markersPoints.push(newmarker);
					} else {
						console.log(aviso.coords, this.map)
					}
				})
			}
		} else {
			this.markersPoints.forEach(marker => {
				marker.remove();
			})
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

		if (this.router.url === '/aviso-crear/nuevo') {
			this.map.on("click", e => {
				// sólo si estoy en la pagina de crear un aviso y si todavía no inserte el marker, puedo insertar el marker.
				if (!this.markerInserted) {
					this.markerInserted = true;
					this.markerNuevoAviso = new mapboxgl.Marker({ draggable: true })
						.setLngLat(e.lngLat.wrap())
						.addTo(this.map);
					this.newMarker.emit(e.lngLat.wrap());
					// Declaro el evento dragend sólo una vez, cuando inicializo mi marker.
					this.markerNuevoAviso.on("dragend", m => {
						// Al mover el marker haciendo DRAG
						this.newMarker.emit(this.markerNuevoAviso.getLngLat());
					});

				} else {
					this.markerNuevoAviso.setLngLat(e.lngLat.wrap());
					this.newMarker.emit(e.lngLat.wrap());
				}
			});
		}
		// Soluciona el problema del tamaño del mapa en un nav-tabs de bootstrap
		this.map.on("load", () => {
			this.map.resize();
			   $('[data-toggle="tab"]').on("shown.bs.tab", () => {
			 	this.map.resize();
			   });
		});
	}

	flyMap(center) {
		this.markerInserted = false;
		if (this.markerNuevoAviso) this.markerNuevoAviso.remove();
		if (this.map) {
			this.map.flyTo({ center });
			//this.map.zoomTo(zoom, { duration: 9000 });
		}
	}
}
