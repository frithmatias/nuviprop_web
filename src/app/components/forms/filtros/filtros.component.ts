import { Component, OnInit, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsService } from '../forms.service';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { formatDate } from '@angular/common';
import { MatSelectionList, MatListOption, MatList } from '@angular/material/list';
import { SelectionModel } from '@angular/cdk/collections/typings/selection';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit {

  // @ViewChild(MatSelectionList, { static: true }) private listaOperaciones: MatSelectionList;

  // OPCIONES TOTALES
  // OPERACIONES e INMUEBLES son datos de scope global los tengo en el servicio formsService
  localidadesCercanas: Localidad[] = [];

  // OPCIONES SELECCIONADAS
  dataBusqueda: any;

  // Arrays donde voy a guardar las opciones seleccionadas en los filtros
  seleccionOperaciones: string[] = [];
  seleccionInmuebles: string[] = [];
  seleccionLocalidades: string[] = [];

  constructor(
    private formsService: FormsService,
    private capitalizarPipe: CapitalizarPipe,
    @Inject(LOCALE_ID) private locale: string
  ) {
    console.log('DATE:', formatDate(new Date(), 'yyyy-MM-dd', this.locale));

  }

  ngOnInit() {

    // Obtengo los datos del formulario guardados en la localstorage
    this.dataBusqueda = JSON.parse(localStorage.getItem('filtros'));
    console.log('filtros aplicados:', this.dataBusqueda);

    // Guardo los datos por defecto
    this.seleccionOperaciones.push(this.dataBusqueda.tipooperacion.nombre);
    this.seleccionInmuebles.push(this.dataBusqueda.tipoinmueble.nombre);
    this.seleccionLocalidades.push(this.dataBusqueda.localidad.nombre);

    // Obtego sugerencias de localidades vecinas
    this.obtenerLocalidadesEnDepartamento(this.dataBusqueda.localidad._id);

  }

  obtenerLocalidadesEnDepartamento(id: string) {
    this.formsService.obtenerLocalidadesEnDepartamento(id).subscribe((data: Localidades) => {
      this.localidadesCercanas = data.localidades;
      console.log('Localidades cercanas: ', this.localidadesCercanas)
    })
  }

}
