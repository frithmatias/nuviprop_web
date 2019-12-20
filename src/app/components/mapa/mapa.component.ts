import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MapaService } from './mapa.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  @ViewChild('mapbox', { static: true }) mapbox;

  constructor(private mapaService: MapaService) { }

  ngOnInit() {
    this.mapaService.inicializarMapa(this.mapbox);
  }



}
