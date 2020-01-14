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

  // dataBusqueda va a guardar los filtros almacenados en la localStorage
  dataBusqueda: any;

  // localidadesCercanas va a guardar las localidades en el departamento de una localidad proveída en dataBusqueda.
  localidadesCercanas: any[] = [];

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


    // Obtengo un valor inicial para las opciones de las localidades 

    // El controls LOCALIDADES itera sobre localidadesCercanas, pero el ngModel sincroniza con seleccionLocalidades 
    // porque tiene que ser un array de strings para que angular pueda decidir si la opcion tiene que estar "checked" 
    // Por eso tengo que hacerlo por separado. Al iniciar la página de avisos sin pasar por el inicio tengo 
    // tengo que cargarle los valores en la localStorage de 'localidades'.
    this.seleccionLocalidades.forEach(localidad => {
      this.localidadesCercanas.push(JSON.parse(localidad));
    })

    // En el formulario de inicio SOLO OBTENGO UNA localidad, por lo tanto en el array hay un solo elemento 
    // que es el que voy a enviarle al metodo para completar el resto de las localidades en el mismo departamento.
    // this.dataBusqueda.localidad[0]
    // if (this.dataBusqueda.localidad && this.dataBusqueda.localidad.length > 0) {
    //   let localidadObj = JSON.parse(this.dataBusqueda.localidad[0]);
    //   this.obtenerLocalidadesEnDepartamento(localidadObj);
    // }

  }

  // Setea el modo de vista seleccionado para que lo levante la page 'avisos'
  tabSelected(tab: number) {
    localStorage.setItem('viewtab', String(tab));
  }

  obtenerLocalidadesEnDepartamento(localidadObj) {
    //console.log('buscando vecinos de: ', localidadObj);
    /*
    Este método hace básicamente dos cosas 
    1. Quita de la lista actual de localidades cercanas las que no fueron seleccionadas 
    2. Quita de la lista nueva de localidades cercanas si existe una localidad que ya esta en la lista de localidades seleccionadas.

    Al buscar una nueva localidad:
    Lista actual
    [_] A - la quito 
    [_] B - la quito
    [x] C - seleccionada, la dejo 
    [x] D - seleccionada, la dejo

    Lista nueva
    [_] X - la agrego
    [_] Y - la agrego
    [_] C - ya existe, la quito
    */

    // 1. DEJO EN LOCALIDADESCERCANAS SOLO LAS LOCALIDADES SELECCIONADAS CONVERTIDAS A OBJETOS.
    let localidadesCercanasSeleccionadas = [];
    this.seleccionLocalidades.forEach(localidadSeleccionada => {
      localidadesCercanasSeleccionadas.push(JSON.parse(localidadSeleccionada));
    });
    this.localidadesCercanas = localidadesCercanasSeleccionadas;


    // 2. Obtengo un array de localidades seleccionadas para saber luego si existen las localidades
    // que voy a agregar luego.
    let arrLocalidadesSeleccionadas = [];
    localidadesCercanasSeleccionadas.forEach(localidad => {
      arrLocalidadesSeleccionadas.push(localidad._id);
    })

    if (arrLocalidadesSeleccionadas.includes(localidadObj._id)) {
      this.snackBar.open(localidadObj.nombre + ' ya esta en la lista.', 'Aceptar', {
        duration: 2000,
      });
    }

    // 3. OBTENGO UNA NUEVA LISTA DE LOCALIDADES CERCANAS
    this.formsService.obtenerLocalidadesEnDepartamento(localidadObj._id).subscribe((data: Localidades) => {
      data.localidades.forEach(localidad => {
        let nombreCapitalizado = this.capitalizarPipe.transform(localidad.properties.nombre);
        // if (localidad.properties.nombre.length > 25) nombreCapitalizado = nombreCapitalizado.substr(0, 25) + '...';

        let localidadVecina = {
          _id: localidad._id,
          nombre: nombreCapitalizado,
          id: nombreCapitalizado.toLowerCase().replace(/ /g, '_')
        }
        // 4. SI NO ESTA EN LA LISTA DE LOCALIDADES SELECCIONADAS (2), LA AGREGO
        if (arrLocalidadesSeleccionadas.includes(localidadVecina._id)) {
        } else {
          this.localidadesCercanas.unshift(localidadVecina);
        }
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

    // Le aviso al padre que hice cambios en los filtors, que busque nuevas avisos.
    this.optionSelected.emit();
  }

  // setLocalidad es un metodo que debería estar sólo en el servicio formsService pero no puedo llamar 
  // a este metodo en formsService porque necesito inyectar el servicio avisosService y me da un 
  // problema de Dependencia circular.
  setLocalidad(localidad) {
    this.formsService.nombreLocalidad = this.formsService.localidadesControl.value.properties.nombre + ', ' + this.formsService.localidadesControl.value.properties.departamento.nombre + ', ' + this.formsService.localidadesControl.value.properties.provincia.nombre;
    let localidadObj = {
      _id: localidad._id,
      nombre: localidad.properties.nombre,
      id: localidad.properties.nombre.toLowerCase().replace(/ /g, '_')
    }
    this.obtenerLocalidadesEnDepartamento(localidadObj);
    let storage: any = {};
    storage = JSON.parse(localStorage.getItem('filtros')) || {};
    storage['localidad'] = [];
    storage['localidad'].push(JSON.stringify(localidadObj));
    localStorage.setItem('filtros', JSON.stringify(storage));

    if (storage && storage.localidad.length > 0) {
      this.formsService.cleanInput();
      this.avisosService.obtenerAvisos();
    } else {
      this.snackBar.open('Por favor ingrese una localidad.', 'Aceptar', {
        duration: 2000,
      });
      return;
    }
  }

}
