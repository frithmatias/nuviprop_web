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
  divfiltersoperaciones = true;
  divfiltersinmuebles = true;
  divfilterslocalidades = true;

  // dataBusqueda va a guardar los filtros almacenados en la localStorage
  dataBusqueda: any;

  // localidadesCercanas va a guardar las localidades en el departamento de una localidad proveída en dataBusqueda.
  localidadesCercanas: any[] = [];

  // Arrays donde voy a guardar las opciones seleccionadas en los filtros (OBJETOS CONVERTIDOS A STRING)
  seleccionOperaciones = [];
  seleccionInmuebles = [];
  seleccionLocalidades = [];

  // Cada vez que se hace un click en el filtro le pido al componente padre que actualice las propiedades.
  @Output() optionSelected: EventEmitter<object> = new EventEmitter()

  // Declaro una nueva propiedad de tipo JSON para poder utilizar sus metodos en el template. De esta manera 
  // puedo guardar un objeto en el valor de cada control CHECK guardando los datos como un string.
  // [value]="JSON.stringify(inmueble)"
  JSON: JSON = JSON;


  constructor(
    private formsService: FormsService,
    @Inject(LOCALE_ID) private locale: string,
    private capitalizarPipe: CapitalizarPipe
  ) {
    // console.log('DATE:', formatDate(new Date(), 'yyyy-MM-dd', this.locale));
  }

  ngOnInit() {

    /*
    Para un control CHECK pueda leer su valor, es decir que sepa cuando debe tener un CHECK y 
    cuando debe quitarlo al momento de leer la localStorage y setear los valores que tenía 
    cargada, tiene que poder comparar sus valores. Aca aparece un problema porque yo necesito 
    guardar objetos en su valor, pero JS no puede comparar bien esos valores, por lo tanto los
    tengo que convertir a STRINGS. En el proceso de lectura de la localStorage tengo que 
    hacer el proceso inverso DOS VECES. Primero porque para leer la localStorage es guardada 
    como un string, y por segunda vez cada uno de sus valores que son objetos guardados 
    como string para convertirlos a objetos nuevamente.
    */

    // Obtengo los datos del formulario guardados en la localstorage
    this.dataBusqueda = JSON.parse(localStorage.getItem('filtros'));

    // Guardo los datos por defecto para mostrar los CHECKS seleccionados en cada lista
    this.dataBusqueda.tipooperacion.forEach(operacion => {
      this.seleccionOperaciones.push(operacion); // operacion es un string.
    })
    this.dataBusqueda.tipoinmueble.forEach(inmueble => {
      this.seleccionInmuebles.push(inmueble);
    })
    this.dataBusqueda.localidad.forEach(localidad => {
      this.seleccionLocalidades.push(localidad);
    })


    // Obtego sugerencias de localidades vecinas a la localidad provista en la localStorage.
    // Convierto a objeto el primer elemento del array 'localidad' en la localStorage guardado como string .
    let localidadObj = JSON.parse(this.dataBusqueda.localidad[0]);
    this.obtenerLocalidadesEnDepartamento(localidadObj._id);
  }

  obtenerLocalidadesEnDepartamento(id: string) {
    this.formsService.obtenerLocalidadesEnDepartamento(id).subscribe((data: Localidades) => {
      console.log(data);
      data.localidades.forEach(localidad => {
        localidad.properties.nombre = this.capitalizarPipe.transform(localidad.properties.nombre);
        let localidadResumida = {
          _id: localidad._id,
          nombre: localidad.properties.nombre,
          id: localidad.properties.nombre.toLowerCase().replace(/ /g, '_')
        }
        this.localidadesCercanas.push(localidadResumida);
      })
    })
  }

  clickCheck() {
    let allChecks = {
      tipooperacion: this.seleccionOperaciones,
      tipoinmueble: this.seleccionInmuebles,
      localidad: this.seleccionLocalidades
    }
    localStorage.setItem('filtros', JSON.stringify(allChecks));
    // Le aviso al padre que hice cambios en los filtors, que busque nuevas propiedades.
    this.optionSelected.emit();
  }



}
