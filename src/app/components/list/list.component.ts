import { Component, OnInit, Input } from '@angular/core';
import { ResultadosService } from '../../pages/resultados/resultados.service';
import { Propiedad } from 'src/app/models/propiedad.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() propiedades: Propiedad[] = [];

  constructor(private resultadosService: ResultadosService) { }

  ngOnInit() {
  }

}
