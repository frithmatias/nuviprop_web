import { Component, OnInit, ViewChild, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { MAPBOX_TOKEN } from "../../config/config";
import { Router } from '@angular/router';
import { ImagenPipe } from 'src/app/pipes/imagen.pipe';

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
	@Input() localidadesActivas: object[]; // center definido en el formulario filtros (checks localidades)
	@Output() newMarker: EventEmitter<{}> = new EventEmitter();

	map: any;
	mapCenterInit = { lng: "-58.43680066430767", lat: "-34.608870104837614" };
	mapZoom = 14;
	markerNuevoAviso: any; // Marker para el mapa Aviso nuevo
	markersAvisos: any[] = []; // Merkers del mapa avisos.
	markerInserted = false; // en crear aviso, es necesario crear solo un marker

	constructor(private router: Router, private imagenPipe: ImagenPipe,
		) { }

	ngOnInit() {}


	ngOnChanges(changes: SimpleChanges) {
		// Necesito inicializar el mapa en ngOnChanges, antes del ciclo de detección de cambios.
		if (!this.map) {
			// Busco en la localstorage de las localidades que fueron seleccionadas.
			let localidades_checked = JSON.parse(localStorage.getItem('filtros'));
			console.log(localidades_checked);

			// Busco en las ultimas localidades, la primer coincidencia con alguna que fue seleccionada y la muestro en el mapa.
			let localidades = JSON.parse(localStorage.getItem('localidades'));

			if(localidades.length>0 && localidades_checked.localidad.length>0){
				for (let i=0; i<localidades.length; i++){
					if(localidades_checked.localidad.includes(localidades[i]._id)){
						this.mapCenterInit = { lng: localidades[i].geometry.coordinates[0], lat: localidades[i].geometry.coordinates[1] };
						break;
					}
				}
			}
			
		
		
			this.inicializarMapa(this.mapbox);
		}
		
		// FORM AVISO-CREAR AL HACER CLICK EN EL CONTROL LOCALIDAD 
		if (changes.center) {
			// Defino la posicion en el mapa dada por el formulario aviso-crear
			this.flyMap(changes.center.currentValue);
		}

		// FORM FILTROS AL HACER CLICK EN UN CHECK DE LOCALIDAD
		if (
			(changes.localidadesActivas !== undefined) && 
			(changes.localidadesActivas.currentValue !== undefined) && 
			(changes.localidadesActivas.currentValue[0] !== undefined)) {
			this.flyMap(changes.localidadesActivas.currentValue[0].geometry.coordinates);
		}

		// MAPA AVISOS
		if (
			(changes.avisos !== undefined) && 
			(changes.avisos.currentValue !== undefined) && 
			changes.avisos.currentValue.length > 0) {
			if (this.router.url === '/avisos') { // solo si estoy en la page AVISOS voy a crear los puntos en el mapa

				this.avisos.forEach((aviso: any) => {
					if (aviso.coords && this.map) { // solo si tiene coordenadas y el mapa existe
						// MARKER POPUP DATA
						var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
							`
							<div class="card">
							<img class="card-img-top" src="${this.imagenPipe.transform(aviso.imgs[0], 'avisos', aviso._id)}" alt="Card image cap">
							<div class="card-body">
							  <h5 class="card-title">${aviso.precio}</h5>
							  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
							  <a href="#/aviso/${aviso._id}">
							  	<button class="btn btn-primary">
								  <i class="mdi mdi-content-paste"></i> Ver aviso
								</button>
							  </a>
							</div>
						  </div>
							`
							);

						// CREATE MARKER
						var el = document.createElement('div');
						el.className = 'marker';
						el.style.backgroundImage = "url('../../../assets/images/mapa/marker-30.png')";
						el.style.width = '30px';
						el.style.height = '30px';
						let newmarker = new mapboxgl.Marker(el)
							.setLngLat(aviso.coords)
							.setPopup(popup) // sets a popup on this marker
							.addTo(this.map);
						this.markersAvisos.push(newmarker);
						
					}
				})
			}
		} 
		else {
			if(this.markersAvisos.length>0){
				this.markersAvisos.forEach(marker => {
					marker.remove();
				})
			}
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

		// CONTROL NAV
		var nav = new mapboxgl.NavigationControl();
		this.map.addControl(nav, "top-right");

		// MAPA EN CREAR AVISO
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

	flyMap(center: string[]) {
		this.markerInserted = false;
		if (this.markerNuevoAviso) this.markerNuevoAviso.remove();
		if (this.map) this.map.flyTo({center});
		//	this.map.zoomTo(this.mapZoom, { duration: 4000 });
	}


}


// function fun_one():any{
// 	return fun_two;
// }
// function fun_two():string{
// 	return "hola";
// }
// console.log(fun_one()());