import { Component, OnInit } from '@angular/core';
import { Propiedad } from 'src/app/models/propiedad.model';
import { MisPropiedadesService } from '../mispropiedades.service';
import { ActivatedRoute } from '@angular/router';
import { MapaService } from 'src/app/components/mapa/mapa.service';

@Component({
  selector: 'app-propiedad-ver',
  templateUrl: './propiedad-ver.component.html',
  styles: [`
  .mapbox{
    height: 200px;
  }
  `]
})
export class PropiedadVerComponent implements OnInit {
  parsetemplate = false; // con *ngIf cargo el templete sólo cuando ya tengo la data
  propiedad: Propiedad;
  id: string;
  constructor(private activatedRoute: ActivatedRoute, private misPropiedadesService: MisPropiedadesService, private mapaService: MapaService) { }

  ngOnInit() {
	document.body.scrollTop = 0; // Safari
	document.documentElement.scrollTop = 0; // Other

	this.activatedRoute.params.subscribe(async params => {
		this.id = params.id;
		await this.cargarPropiedad(this.id).then(() => {
		this.parsetemplate = true;
		});
	});
  }

  cargarPropiedad(id: string) {
	return new Promise((resolve, reject) => {
		this.misPropiedadesService.obtenerPropiedad(id).subscribe((propiedad: Propiedad) => {
		this.propiedad = propiedad;
		// this.files = propiedad.imgs;
		resolve();
		});

	});
  }
}
