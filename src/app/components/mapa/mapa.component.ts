import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MapaService } from './mapa.service';
import { Aviso } from 'src/app/models/aviso.model';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  @ViewChild('mapbox', { static: true }) mapbox;
  @Input() avisos: Aviso[] = [];
  constructor(private mapaService: MapaService) { }

  ngOnInit() {
    this.mapaService.inicializarMapa(this.mapbox);
  }



}
