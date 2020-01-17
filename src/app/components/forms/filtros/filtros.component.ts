import { Component, OnInit, Inject, LOCALE_ID, Output, EventEmitter } from '@angular/core';
import { FormsService } from '../forms.service';
import { formatDate } from '@angular/common';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { AvisosService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit {

  divfiltersoperaciones = true;
  divfiltersinmuebles = true;
  divfilterslocalidades = true;

  // filtrosStorage va a guardar los filtros almacenados en la localStorage
  filtrosStorage: any;

  // Arrays donde voy a guardar las opciones seleccionadas en los filtros (OBJETOS CONVERTIDOS A STRING)
  seleccionOperaciones = [];
  seleccionInmuebles = [];
  seleccionLocalidades = [];

  // Cada vez que se hace un click en el filtro le pido al componente padre que actualice las avisos.
  @Output() optionSelected: EventEmitter<object> = new EventEmitter()

  // Declaro un nuevo aviso de tipo JSON para poder utilizar sus metodos en el template. De esta manera 
  // puedo guardar un objeto en el valor de cada control CHECK guardando los datos como un string.
  // [value]="JSON.stringify(inmueble)"

  JSON: JSON = JSON;


  constructor(
    private formsService: FormsService,
    @Inject(LOCALE_ID) private locale: string,
    private capitalizarPipe: CapitalizarPipe,
    private avisosService: AvisosService,
    private snackBar: MatSnackBar
  ) {
    // console.log('DATE:', formatDate(new Date(), 'yyyy-MM-dd', this.locale));
  }

  ngOnInit() {

    // Obtengo los datos del formulario guardados en la localstorage
    this.filtrosStorage = JSON.parse(localStorage.getItem('filtros'));
    // Guardo los datos por defecto para mostrar los CHECKS seleccionados en cada lista
    // TIPOS DE OPERACION (VALORES SELECCIONADOS)
    this.filtrosStorage.tipooperacion.forEach(operacion => {
      this.seleccionOperaciones.push(operacion); // operacion es un string.
    })

    // TIPOS DE INMUEBLE (VALORES SELECCIONADOS)
    this.filtrosStorage.tipoinmueble.forEach(inmueble => {
      this.seleccionInmuebles.push(inmueble);
    })

    // LOCALIDADES (VALORES SELECCIONADOS)
    this.filtrosStorage.localidad.forEach(localidad => {
      this.seleccionLocalidades.push(localidad);
    })


  }

  // Setea el modo de vista seleccionado para que lo levante la page 'avisos'
  tabSelected(tab: number) {
    localStorage.setItem('viewtab', String(tab));
  }


  clickCheck() {

    // los filtros en seleccionOperaciones, seleccionInmuebles, seleccionLocalidades 
    // son array de strings que van directo al metodo obtenerAvisos(filtros) desde
    // el componente padre. 

    let filtros = {
      tipooperacion: this.seleccionOperaciones,
      tipoinmueble: this.seleccionInmuebles,
      localidad: this.seleccionLocalidades
    }

    // por otra vía, viajan los objetos de los filtros hacia la localstorage para recuperarlos
    // al recargar la página. Reconstruyo los objetos a partir de los _id seleccionados en 
    // seleccionOperaciones, seleccionInmuebles, seleccionLocalidades y obteniendo el resto de 
    // los datos de:
    // formsService.tiposInmuebles 
    // formsService.tiposOperaciones
    // formsService.localidadesCercanas

    // Para las localidades, ademas guardo en la localstorage el último resultado de localidadesVecinas.
    localStorage.setItem('filtros', JSON.stringify(filtros));
    // let filtrosStorage = {

    // }

    // Le aviso al padre que hice cambios en los filtors, que busque nuevas avisos.

    this.optionSelected.emit(filtros);
  }


}
