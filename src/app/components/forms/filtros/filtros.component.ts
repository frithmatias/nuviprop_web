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
    // console.log('DATE:', formatDate(new Date(), 'yyyy-MM-dd', this.locale));

  }

  ngOnInit() {

    // Obtengo los datos del formulario guardados en la localstorage
    this.dataBusqueda = JSON.parse(localStorage.getItem('filtros'));

    // Guardo los datos por defecto para mostrar los CHECKS seleccionados en cada lista
    this.dataBusqueda.tipooperacion.forEach(operacion => {
      this.seleccionOperaciones.push(operacion);
    })

    this.dataBusqueda.tipoinmueble.forEach(inmueble => {
      this.seleccionInmuebles.push(inmueble);
    })

    this.dataBusqueda.localidad.forEach(localidad => {
      this.seleccionLocalidades.push(localidad);
    })

    // Obtego sugerencias de localidades vecinas a la localidad provista en la localStorage.
    this.obtenerLocalidadesEnDepartamento(this.dataBusqueda.localidad[0]._id);

    // Envio los checks seleccionados al padre para mostrar los filtros.
    this.clickFiltros();
  }

  obtenerLocalidadesEnDepartamento(id: string) {
    this.formsService.obtenerLocalidadesEnDepartamento(id).subscribe((data: Localidades) => {
      data.localidades.forEach(localidad => {
        localidad.properties.nombre = this.capitalizarPipe.transform(localidad.properties.nombre);
      })
      this.localidadesCercanas = data;
    })
  }

  clickFiltros() {
    // en el atributo value de cada check envio todo el objeto entero porque en el padre necesito no solo el 
    // nombre sino también el _id para hacer match en la bd. Al momento de mostrar el nombre puedo hacer 
    // objeto.nombre en el componente padre.

    // Este objeto allChecks queda como un objetos que contiene varios array de objetos, uno por cada filtro.

    //     {operaciones: Array(3), inmuebles: Array(1), localidades: Array(1)}
    //        operaciones: Array(3)
    //            0: {_id: "5e04b4bd3cb7d5a2401c9895", nombre: "Venta", id: "venta"}
    //            1: {_id: "5e04b4ce3cb7d5a2401c98a5", nombre: "Alquiler", id: "alquiler"}
    //            2: {_id: "5e04b4e73cb7d5a2401c98ae", nombre: "Alquiler por temporada", id: "alquilerportemporada"}
    //            length: 3
    //        
    //        inmuebles: Array(1)
    //            0: {_id: "5e04bf7a3cb7d5a2401c9b15", nombre: "Departamento", id: "tipoinmueble_departamento"}
    //            length: 1
    //        
    //        localidades: Array(1)
    //            0: {properties: {…}, geometry: {…}, _id: "5df2eb1e64b1fc02b5e1f50a", type: "Feature"}
    //            length: 1
    //        
    let allChecks = {
      tipooperacion: this.seleccionOperaciones,
      tipoinmueble: this.seleccionInmuebles,
      localidad: this.seleccionLocalidades
    }

    localStorage.setItem('filtros', JSON.stringify(allChecks));
    this.optionSelected.emit();
  }
}
