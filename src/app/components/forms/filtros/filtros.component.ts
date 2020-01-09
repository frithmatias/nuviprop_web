import { Component, OnInit, Inject, LOCALE_ID, Output, EventEmitter } from '@angular/core';
import { FormsService } from '../forms.service';
import { formatDate } from '@angular/common';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';
import { PropiedadesService } from 'src/app/services/services.index';
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
    private capitalizarPipe: CapitalizarPipe,
    private propiedadesService: PropiedadesService,
    private snackBar: MatSnackBar
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
    console.log(this.dataBusqueda);
    if (!this.dataBusqueda) {
      return;
    }
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

    /*
    En la localStorage tengo un array de objetos de localidades convertidos a Strings. Tengo que
    parsear cada objeto para obtener las localidades vecinas de cada localidad (dentro de su departamento). 
    
    localidad: Array(3)
        0: "{"_id":"5df2eb5664b1fc02b5e1fdef","nombre":"Villa Devoto","id":"villa_devoto"}"
        1: "{"_id":"5df2eb5664b1fc02b5e1fdf0","nombre":"Villa General Mitre","id":"villa_general_mitre"}"
        2: "{"_id":"5df2eb5664b1fc02b5e1fdf1","nombre":"Villa Santa Rita","id":"villa_santa_rita"}"
        length: 3
    */

    // En el formulario de inicio SOLO OBTENGO UNA localidad, por lo tanto en el array hay un solo elemento 
    // que es el que voy a enviarle al metodo para completar el resto de las localidades en el mismo departamento.
    // this.dataBusqueda.localidad[0]
    if (this.dataBusqueda.localidad && this.dataBusqueda.localidad.length > 0) {
      let localidadObj = JSON.parse(this.dataBusqueda.localidad[0]);
      this.obtenerLocalidadesEnDepartamento(localidadObj);
    }

  }

  obtenerLocalidadesEnDepartamento(localidadObj) {
    this.formsService.obtenerLocalidadesEnDepartamento(localidadObj._id).subscribe((data: Localidades) => {

      this.localidadesCercanas = []
      data.localidades.forEach(localidad => {
        localidad.properties.nombre = this.capitalizarPipe.transform(localidad.properties.nombre);
        let localidadesVecinas = {
          _id: localidad._id,
          nombre: localidad.properties.nombre,
          id: localidad.properties.nombre.toLowerCase().replace(/ /g, '_')
        }
        this.localidadesCercanas.push(localidadesVecinas);
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


  setLocalidad(localidad) {
    this.obtenerLocalidadesEnDepartamento(localidad);
    // No puedo llamar al metodo setLocalidad de formsService porque necesito submitirlo y para submitirlo 
    // necesito inyectar el servicio propiedadesService y me da un problema de Dependencia circular.

    this.formsService.nombreLocalidad = this.formsService.localidadesControl.value.properties.nombre + ', ' + this.formsService.localidadesControl.value.properties.departamento.nombre + ', ' + this.formsService.localidadesControl.value.properties.provincia.nombre;
    let localidadObj = {
      _id: localidad._id,
      nombre: localidad.properties.nombre,
      id: localidad.properties.nombre.toLowerCase().replace(/ /g, '_')
    }
    let storage: any = {};
    storage = JSON.parse(localStorage.getItem('filtros')) || {};
    storage['localidad'] = [];
    storage['localidad'].push(JSON.stringify(localidadObj));
    localStorage.setItem('filtros', JSON.stringify(storage));

    if (storage && storage.localidad.length > 0) {
      this.formsService.cleanInput();
      this.propiedadesService.obtenerPropiedades();
    } else {
      this.snackBar.open('Por favor ingrese una localidad.', 'Aceptar', {
        duration: 2000,
      });
      return;
    }
  }

}
