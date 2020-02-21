import { Component, OnInit, ViewChild, Input, SimpleChanges, EventEmitter, Output, OnChanges } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MAPBOX_TOKEN } from '../../config/config';
import { Router } from '@angular/router';
import { ImagenPipe } from 'src/app/pipes/imagen.pipe';
import { PricekPipe } from 'src/app/pipes/pricek.pipe';

declare var mapboxgl: any;
@Component({
	selector: 'app-mapa',
	templateUrl: './mapa.component.html',
	styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit, OnChanges {
	@ViewChild('mapbox', { static: true }) mapbox;
	@Input() avisos: Aviso[] = [];
	@Input() center: string[] = []; // center definido en el formulario aviso-crear
	@Input() mapCoords: string[]; // center definido en el formulario filtros (checks localidades)
	@Output() newMarker: EventEmitter<{}> = new EventEmitter();

	map: any;
	mapCenterInit = { lng: '-58.43680066430767', lat: '-34.608870104837614' };
	mapZoom = 14;
	markerAviso: any; // Marker para el mapa Aviso nuevo
	markersAvisos: any[] = []; // Merkers del mapa avisos.
	markerInserted = false; // en crear aviso, es necesario crear solo un marker

	constructor(private router: Router, private imagenPipe: ImagenPipe, private pricekPipe: PricekPipe
	) { }

	ngOnInit() { }


	ngOnChanges(changes: SimpleChanges) {
		if (!this.map) {
			const filtros = JSON.parse(localStorage.getItem('filtros'));
			const localidades = JSON.parse(localStorage.getItem('localidades'));
			if ((filtros.localidad.length > 0) && (localidades.length > 0)) {
				if (filtros.localidad[0] === 'indistinto') {
					// Si es indistinto agarro CUALQUIERA de las localidades vecinas de localStorage.getItem('localidades')
					// tomo localidades[1], porque localidades[0] es la opción 'indistinto'
					this.mapCenterInit = { lng: localidades[1].geometry.coordinates[0], lat: localidades[1].geometry.coordinates[1] };
				}
			}
			this.inicializarMapa(this.mapbox);
		}

		// =======================================================================
		// [AVISO] (NUEVO Y EDICION) SI CAMBIA LA POSICION DEL MARKER AL HACER CLICK EN EL MAPA
		// =======================================================================
		if (changes.center !== undefined && changes.center.currentValue !== undefined) {

			// Si hay coordenadas estoy en editar aviso, centro el mapa y pongo el marker en las coordenadas del aviso
			if (changes.center.currentValue.length > 0) {
				this.flyMap([changes.center.currentValue, changes.center.currentValue]);
				this.markerAviso = new mapboxgl.Marker({ draggable: true })
					.setLngLat(changes.center.currentValue)
					.addTo(this.map);
				this.markerInserted = true;
				this.markerAviso.on('dragend', e => {
					// this.newMarker.emit(this.markerAviso.getLngLat());
					this.markerAviso.setLngLat(e.target._lngLat);
					this.newMarker.emit(e.target._lngLat);
				});
			}


			this.map.on('click', e => {
				if (!this.markerInserted) { // Si no se inserto estoy en un aviso nuevo, espero a que el usuario ponga el marker.
					this.markerAviso = new mapboxgl.Marker({ draggable: true })
						.setLngLat(e.lngLat.wrap())
						.addTo(this.map);
					this.markerInserted = true;
				}
				this.newMarker.emit(e.lngLat.wrap());
				this.markerAviso.setLngLat(e.lngLat.wrap());
				this.markerAviso.on('dragend', e => {
					// this.newMarker.emit(this.markerAviso.getLngLat());
					this.markerAviso.setLngLat(e.target._lngLat);
					this.newMarker.emit(e.target._lngLat);
				});
			});

		}

		// =======================================================================
		// [FILTROS] SI CAMBIAN LAS COORDENADAS AL HACER CLICK EN UN CHECK DE LOCALIDAD
		// =======================================================================
		// mapCoords:
		// 0: (2) [-58.4628575470422, -34.5548815240237] PUNTO SUR-ESTE
		// 1: (2) [-58.4502890947349, -34.5437376606688] PUNTO NOR-OESTE
		if ((changes.mapCoords !== undefined) && (changes.mapCoords.currentValue !== undefined)) {
			this.flyMap(changes.mapCoords.currentValue);
		}

		// =======================================================================
		// SI CAMBIAN LOS AVISOS
		// =======================================================================
		if ((changes.avisos !== undefined) && (changes.avisos.currentValue !== undefined) && changes.avisos.currentValue.length > 0) {
			if (this.router.url === '/avisos') { // solo si estoy en la page AVISOS voy a crear los puntos en el mapa

				// =======================================================================
				// MUESTRO LAS ETIQUETAS DE LOS NUEVOS AVISOS
				// =======================================================================
				this.avisos.forEach((aviso: any) => {
					if (aviso.coords && this.map) { // solo si tiene coordenadas y el mapa existe
						// CREATE MARKER
						const label = document.createElement('div');
						label.innerHTML = `<span class="marker-text">${aviso.tipocambio.simbolo} ${this.pricekPipe.transform(aviso.precio)}</span>`;
						const newmarker = new mapboxgl.Marker(label)
							.setLngLat(aviso.coords)
							.addTo(this.map);
						this.markersAvisos.push(newmarker);

					}
				});

				// =======================================================================
				// MUESTRO ICONOS Y POPUPS DE LOS NUEVOS AVISOS
				// =======================================================================
				this.avisos.forEach((aviso: any) => {
					if (aviso.coords && this.map) { // solo si tiene coordenadas y el mapa existe
						// MARKER POPUP DATA
						const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
							`
							<div class="card rounded">
							<img class="card-img-top" src="${this.imagenPipe.transform(aviso.imgs[0], 'avisos', aviso._id)}" alt="Card image cap">
							<div class="card-body">
							<hr>  
							<h5 class="card-title" style="font-weight: 600;">${aviso.tipocambio.simbolo} ${aviso.precio}</h5>
							  <h6><p>${aviso.titulo}</p></h6>
							  <a href="#/aviso/${aviso._id}">
							  	<button class="btn btn-primary btn-block btn-sm">
								  <i class="mdi mdi-content-paste"></i> Ver aviso
								</button>
							  </a>
							</div>
						  </div>
							`
						);

						// CREATE MARKER
						const icon = document.createElement('div');
						icon.className = 'marker';
						icon.style.backgroundImage = 'url(\'../../../assets/images/mapa/marker-30.png\')';
						icon.style.width = '30px';
						icon.style.height = '30px';
						const newmarker = new mapboxgl.Marker(icon)
							.setLngLat(aviso.coords)
							.setPopup(popup) // sets a popup on this marker
							.addTo(this.map);
						this.markersAvisos.push(newmarker);

					}
				});

			}
		} else {
			if (this.markersAvisos.length > 0) {
				this.markersAvisos.forEach(marker => {
					marker.remove();
				});
			}
		}

	}


	inicializarMapa(mapbox) {

		const lat = Number(this.mapCenterInit.lat);
		const lng = Number(this.mapCenterInit.lng);

		mapboxgl.accessToken = MAPBOX_TOKEN;
		this.map = new mapboxgl.Map({
			container: mapbox.nativeElement,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: this.mapZoom
		});

		// CONTROL NAV
		const nav = new mapboxgl.NavigationControl();
		this.map.addControl(nav, 'bottom-right');


		// RESETEA EL MAPA PARA ADAPATARLO AL TAMAÑO DE LA PANTALLA
		this.map.on('load', () => {
			this.map.resize();
			$('[data-toggle="tab"]').on('shown.bs.tab', () => {
				this.map.resize();
			});
		});
	}

	flyMap(center: string[]) {
		if (this.markerAviso) { this.markerAviso.remove(); }
		// Desde filtros.component envío const coords = [[O, S], [E, N]];
		// Si se trata de UN SOLO Marker, entonces O=E y S=N por lo tanto no hay que centrar con fitBounds sino
		// que el mapa tiene que viajar hacia un solo punto con flyTo.
		if (center[0][0] === center[1][0] && center[0][1] === center[1][1]) {
			// 	this.map.zoomTo(this.mapZoom, { duration: 4000 });
			if (this.map) { this.map.flyTo({ center: [String(center[0][0]), String(center[0][1])] }); }
		} else {
			// centro desde el marker mas SO hacia el marker mas NE
			this.map.fitBounds(center, {
				padding: { top: 50, bottom: 50, left: 50, right: 50 }
			});
		}
	}


}

// function fun_one():any{
// 	return fun_two;
// }
// function fun_two():string{
// 	return "hola";
// }
// console.log(fun_one()());
