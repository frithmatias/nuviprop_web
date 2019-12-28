import { Component, OnInit } from '@angular/core';
import { FindpropService } from './findprop.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
declare function init_plugins();
@Component({
  selector: 'app-findprop',
  templateUrl: './findprop.component.html',
  styleUrls: ['./findprop.component.css']
})
export class FindpropComponent implements OnInit {
  // Control Autocomplete
  formGroup: FormGroup;
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<string[]>;
  operaciones: any[];
  inmuebles: any[];

  valuesToSearch = {
    tipooperacion: '',
    tipoinmueble: '',
    localidad: ''
  };

  constructor(private findpropService: FindpropService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {

    this.formGroup = this.formBuilder.group({
      tipoinmueble: ['', [Validators.required, Validators.minLength(5)]],
      tipooperacion: ['', [Validators.required, Validators.minLength(5)]],
      localidad: ['', [Validators.required, Validators.minLength(5)]]
    });

  }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      tipooperacion: ['', [Validators.required, Validators.minLength(5)]],
      tipoinmueble: ['', [Validators.required, Validators.minLength(5)]],
      localidad: ['', [Validators.required, Validators.minLength(3)]],
    });

    init_plugins();
    this.obtenerOperaciones();
    this.obtenerInmuebles();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    if (!value) {
      return;
    }
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => {
      return option.properties.nombre.toLowerCase().includes(filterValue);
    });
  }

  obtenerOperaciones() {
    this.findpropService.obtenerOperaciones().subscribe((data: any) => {
      this.operaciones = data.operaciones;
    });
  }

  obtenerInmuebles() {
    this.findpropService.obtenerInmuebles().subscribe((data: any) => {
      this.inmuebles = data.inmuebles;
    });
  }

  buscarLocalidad(event) {

    const regex = new RegExp(/^[a-z0-9]+$/i);
    if (!regex.test(event.target.value)) {
      this.snackBar.open('¡Ingrese sólo caracteres alfanuméricos!', 'Aceptar', {
        duration: 2000,
      });
      return;
    }

    if (event.target.value.length === 3) {
      // Con el fin de evitar sobrecargar al server con peticiones de datos duplicados, le pido al backend
      // que me envíe resultados SOLO cuando ingreso tres caracteres, a partir de esos resultados
      // el filtro lo hace el cliente en el frontend con los datos ya almacenados en this.options.


      this.findpropService.buscarLocalidad(event.target.value).subscribe((localidades: Localidades) => {
        if (localidades.ok) {
          this.options = [];
          localidades.localidades.forEach(localidad => {
            this.options.push(localidad);
          });
        }
      });
    }
  }

  setInmueble() {
    // Este metodo NO ES necesario porque como se trata de un control SELECT el dato se
    // guarda automaticamente en el formulario (formGroup) al seleccionar una opción.
  }
  setLocalidad(localidad) {
    // Este metodo podría no ser necesario, pero tengo que enviar el nombre (string) al control
    // y el id (number) hacia un nuevo objeto que voy a enviar al backend. Esto es porque yo
    // necesito enviar el id, pero si guardo el ID en el form, en el control voy a ver el ID en lugar
    // del string localidad, departamento, provincia.

    this.formGroup.patchValue({
      localidad: `${localidad.properties.nombre}, ${localidad.properties.departamento.nombre}, ${localidad.properties.provincia.nombre}`
    });
    this.valuesToSearch.localidad = localidad.properties.id;

  }

  setOperacion(operacion: any) {
    this.formGroup.patchValue({
      tipooperacion: operacion._id
    });
  }

  enviarFormulario() {
    // Envío los datos obtenidos en el formulario a mi objeto con los datos a enviar al backend.
    this.valuesToSearch.tipooperacion = this.formGroup.value.tipooperacion;
    this.valuesToSearch.tipoinmueble = this.formGroup.value.tipoinmueble;

    // los valores de tipooperacion y tipoinmueble puedo sacarlos del formulario, pero la localidad no porque
    // viene de un INPUT TEXT y si yo intento guardar el valor ID en el fomulario (formGroup.value.localidad)
    // me va a mostrar el ID en el INPUT del formulario, y yo ahí quiero ver el nombre de localidad, dpto y pvcia.
    // Para eso creo un nuevo objeto para enviar localidad.propierties.nombre al INPUT y localidad.properties.id
    // al objeto. De esta manera en mi objeto tengo sólo los IDs de tipooperacion, tipoinmueble, localidad.
  }
}
