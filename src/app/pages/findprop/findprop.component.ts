import { Component, OnInit } from '@angular/core';
import { FindpropService } from './findprop.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
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
  constructor(private findpropService: FindpropService, private formBuilder: FormBuilder) {

    this.formGroup = this.formBuilder.group({
      tipoinmueble: ['', [Validators.required, Validators.minLength(5)]],
      tipooperacion: ['', [Validators.required, Validators.minLength(5)]],
      localidad: ['', [Validators.required, Validators.minLength(5)]]
    });

  }

  ngOnInit() {
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
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => {

      return option.properties.nombre.toLowerCase().includes(filterValue);

    });
  }

  seleccionLocalidad(event) {
    console.log('Selecciono Localidad: ', event);
    console.log('Nuevo FormGroup: ', this.formGroup);

    this.formGroup.patchValue({
      localidad: event.properties.nombre,
      departamento: event.properties.departamento.nombre,
      provincia: event.properties.provincia.nombre,
      coords: [event.geometry.coordinates[0], event.geometry.coordinates[1]]
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
    if (event.target.value.length === 3) {
      // Con el fin de evitar sobrecargar al server con peticiones de datos duplicados, le pido al backend
      // que me envíe resultados SOLO cuando ingreso tres caracteres, a partir de esos resultados
      // el filtro lo hace el cliente en el frontend con los datos ya almacenados en this.options.


      console.log('buscando ', event.target.value);
      this.findpropService.buscarLocalidad(event.target.value).subscribe((localidades: Localidades) => {
        console.log(localidades);
        if (localidades.ok) {
          this.options = [];
          localidades.localidades.forEach(localidad => {
            this.options.push(localidad);
          });
        }
      });
    }
  }
  setOperacion(id: string) {
    console.log(id);
  }
}
