import { Component, OnInit, Inject, LOCALE_ID, Output, EventEmitter } from '@angular/core';
import { FormsService } from '../forms.service';
import { formatDate } from '@angular/common';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';


@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent implements OnInit {
  divfiltersoperaciones = false;
  divfiltersinmuebles = false;
  divfilterslocalidades = false;



  // @ViewChild(MatSelectionList, { static: true }) private listaOperaciones: MatSelectionList;

  // OPCIONES TOTALES
  // OPERACIONES e INMUEBLES son datos de scope global los tengo en el servicio formsService



  // OPCIONES SELECCIONADAS

  // dataBusqueda va a guardar los filtros almacenados en la localStorage
  dataBusqueda: any;

  // localidadesCercanas va a guardar las localidades en el departamento de una localidad proveída en dataBusqueda.
  localidadesCercanas: Localidades;

  // Arrays donde voy a guardar las opciones seleccionadas en los filtros
  seleccionOperaciones: string[] = [];
  seleccionInmuebles: string[] = [];
  seleccionLocalidades: string[] = [];

  // Cada vez que se hace un click en el filtro voy a enviar los valores de todos los checks 
  // guardados en un objeto allChecks para mostrarlos en el componente padre (propiedades)
  @Output() optionSelected: EventEmitter<object> = new EventEmitter()

  constructor(
    private formsService: FormsService,
    @Inject(LOCALE_ID) private locale: string,
    private capitalizarPipe: CapitalizarPipe
  ) {
    console.log('DATE:', formatDate(new Date(), 'yyyy-MM-dd', this.locale));

  }

  ngOnInit() {

    // Obtengo los datos del formulario guardados en la localstorage
    this.dataBusqueda = JSON.parse(localStorage.getItem('filtros'));
    console.log('filtros aplicados:', this.dataBusqueda);

    // Guardo los datos por defecto para mostrar los CHECKS seleccionados en cada lista
    this.seleccionOperaciones.push(this.dataBusqueda.tipooperacion.nombre);
    this.seleccionInmuebles.push(this.dataBusqueda.tipoinmueble.nombre);
    this.seleccionLocalidades.push(this.dataBusqueda.localidad.nombre);

    // Obtego sugerencias de localidades vecinas a la localidad provista en la localStorage.
    this.obtenerLocalidadesEnDepartamento(this.dataBusqueda.localidad._id);

    // Envio los checks seleccionados al padre para mostrar los filtros.
    this.enviarFiltros();
  }

  obtenerLocalidadesEnDepartamento(id: string) {
    this.formsService.obtenerLocalidadesEnDepartamento(id).subscribe((data: Localidades) => {
      console.log('localidades cercanas respuesta del servicio:', data);


      data.localidades.forEach(localidad => {
        localidad.properties.nombre = this.capitalizarPipe.transform(localidad.properties.nombre);
      })
      this.localidadesCercanas = data;
      console.log('Localidades cercanas: ', this.localidadesCercanas)
    })
  }

  enviarFiltros() {
    let allChecks = {
      operaciones: this.seleccionOperaciones,
      inmuebles: this.seleccionInmuebles,
      localidades: this.seleccionLocalidades
    }
    this.optionSelected.emit(allChecks);
    console.log('se hizo click en filtros');
  }
}
