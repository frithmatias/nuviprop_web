import { Component, OnInit } from '@angular/core';
import { Propiedad } from 'src/app/models/propiedad.model';
import { PropiedadesService } from './propiedades.service';
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
  constructor(private activatedRoute: ActivatedRoute, private propiedadesService: PropiedadesService, private mapaService: MapaService) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      console.log('id ', this.id);


      this.cargarPropiedad(this.id).then(() => {
        this.parsetemplate = true;
      });




    });
  }

  cargarPropiedad(id: string) {
    return new Promise((resolve, reject) => {
      this.propiedadesService.obtenerPropiedad(id).subscribe((propiedad: Propiedad) => {
        this.propiedad = propiedad;
        // this.files = propiedad.imgs;
        console.log('Propiedad obtenida: ', propiedad);
        resolve();
      });

    });
  }
}
