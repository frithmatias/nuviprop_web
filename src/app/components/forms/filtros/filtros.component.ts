import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsService } from '../forms.service';
import { TiposOperaciones } from 'src/app/models/tipos_operacion.model';
import { TiposInmuebles } from 'src/app/models/tipos_inmueble.model';
import { RespProvincias } from 'src/app/models/tipos_provincia.model';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit {


  operacionControl = new FormControl();
  inmuebleControl = new FormControl();
  filtros: object = {};

  constructor(private formsService: FormsService) { }

  ngOnInit() {
    this.filtros = JSON.parse(localStorage.getItem('filtros'));
    console.log('filtros aplicados:', this.filtros);
  }
}
