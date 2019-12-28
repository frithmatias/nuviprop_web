import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Propiedad } from 'src/app/models/propiedad.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService } from '../forms.service';
import { TiposOperaciones, TipoOperacion } from 'src/app/models/tipos_operacion.model';
import { TiposInmuebles, TipoInmueble } from 'src/app/models/tipos_inmueble.model';
import { TipoUnidad, TiposUnidades } from 'src/app/models/tipos_unidad.model';

@Component({
  selector: 'app-form-propiedad-aviso',
  templateUrl: './propiedad-aviso.component.html',
  styleUrls: ['./propiedad-aviso.component.scss']
})
export class PropiedadAvisoComponent implements OnInit {
  @Input() formData: Propiedad;
  @Output() outputGroup: EventEmitter<FormGroup> = new EventEmitter();

  parsetemplate = false;
  propId: string;
  formGroup: FormGroup = new FormGroup({});
  operaciones: TipoOperacion[] = [];
  inmuebles: TipoInmueble[] = [];
  unidades: TipoUnidad[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private formsService: FormsService
  ) { }

  ngOnInit() {
    this.obtenerOperaciones();
    this.obtenerInmuebles();
    this.buildForm().then(() => {
      this.formGroup.patchValue({
        calle: this.formData.calle,
        altura: this.formData.altura,
        piso: this.formData.piso,
        depto: this.formData.depto,
        tipoinmueble: this.formData.tipoinmueble,
        tipounidad: this.formData.tipounidad,
        tipooperacion: this.formData.tipooperacion,
        titulo: this.formData.titulo,
        descripcion: this.formData.descripcion,
        precio: this.formData.precio,
        moneda: this.formData.moneda,
        nopublicarprecio: this.formData.nopublicarprecio,
        aptocredito: this.formData.aptocredito,
        provincia: this.formData.provincia,
        departamento: this.formData.departamento,
        localidad: this.formData.localidad,
        coords: [this.formData.coords[0], this.formData.coords[1]],
        codigopostal: this.formData.codigopostal,
      });
      this.parsetemplate = true;
    }
    );


  }


  buildForm() {
    return new Promise(resolve => {
      // El valor por defecto '' en este caso NO es necesario, porque yo no estoy trabajando
      // con un objeto 'propiedad', estoy trabajando DIRECTAMENTE con el objeto formGroup.value
      // en donde yo guardo la data de la propiedad, y desde donde los controles en el formulario
      // van a buscar la data.

      // En general la configuración sería
      // [value]="propiedad.titulo" -> propiedad.titulo <- formGroup.value.titulo

      // En este caso utilizo el metodo patchValue({...}) para guardar la data en mi formGroup
      // [value]="formGroup.value.titulo" <-> formGroup.value.titulo
      this.formGroup = this.formBuilder.group({
        calle: ['', [Validators.required, Validators.minLength(5)]],
        altura: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
        piso: ['', [Validators.pattern('[0-9]{1,5}')]],
        depto: ['', [Validators.pattern('[a-z][A-Z][0-9]{1,5}')]],
        tipoinmueble: ['', [Validators.required]],
        tipounidad: [''],
        tipooperacion: ['', [Validators.required]],
        titulo: ['', [Validators.required, Validators.minLength(10)]],
        descripcion: ['', [Validators.required, Validators.minLength(100)]],
        precio: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
        moneda: ['', [Validators.required]],
        nopublicarprecio: ['', [Validators.required]],
        aptocredito: ['', [Validators.required]],
        provincia: ['', [Validators.required, Validators.minLength(5)]],
        departamento: ['', [Validators.required, Validators.minLength(3)]],
        localidad: ['', [Validators.required, Validators.minLength(5)]],
        coords: this.formBuilder.array([
          this.formBuilder.control({ value: 33 }, [Validators.required]),
          this.formBuilder.control({ value: 44 }, [Validators.required])
        ]),
        codigopostal: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{4,10}')]]
      });
      resolve();
    });
  }



  obtenerOperaciones() {
    this.formsService.obtenerOperaciones().subscribe((data: TiposOperaciones) => {
      this.operaciones = data.operaciones;
    });
  }

  obtenerInmuebles() {
    this.formsService.obtenerInmuebles().subscribe((data: TiposInmuebles) => {
      this.inmuebles = data.inmuebles;
    });
  }



  enviarFormulario() {
    if (this.formGroup.valid) {
      this.outputGroup.emit(this.formGroup);
    } else {
      this.openSnackBar('Faltan datos, por favor verifique.', 'Aceptar');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


  checkForFills(inmueble: TipoInmueble) {
    this.formsService.obtenerUnidades(inmueble.id).subscribe((data: TiposUnidades) => {
      this.unidades = data.unidades;
    });
  }



}
