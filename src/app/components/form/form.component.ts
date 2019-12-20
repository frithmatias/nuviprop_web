import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormService } from './form.service';
import { FormData, respForm } from 'src/app/models/form.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  parsehtml = false;
  formControls: FormData;
  formAviso: FormGroup;
  defaultForm: any = {};
  @Input() formData: any;
  @Input() formName: string;  // recibo el ID del formulario a mostrar.
  @Input() propId: string;
  @Output() submitForm: EventEmitter<string> = new EventEmitter();




  constructor(private formService: FormService, private formBuilder: FormBuilder) {

  }


  ngOnInit() {

    // OBTENGO LOS CONTROLES
    this.formService.obtenerFormulario(this.formName).subscribe((data: respForm) => {
      this.formControls = data.form[0];
      this.parsehtml = true;
    });

    // SI ES UNA EDICION OBTENGO LA DATA
    if (this.propId !== 'nuevo') {
      this.defaultForm = this.formData;
    } else {
      this.defaultForm = {
        calle: 'Mercedes',
        altura: 2325,
        piso: '',
        depto: '',
        tipo_inmueble: 'Terreno',
        tipo_unidad: 'tipo_unidad',
        tipo_operacion: 'Venta',
        titulo: 'Este es el titulo del aviso',
        descripcion: 'La descripcion tiene que ser larga debe superar los 50 caracteres para validar el control de lo contrario no se puede submitir.',
        precio: '490000',
        radiogroup_moneda: 'radiogroup_moneda_dolares',
        no_publicar_precio: true,
        apto_credito: false,
        pais: 'Argentina',
        provincia: 'Ciudad de Buenos Aires',
        partido: 'Ciudad de Buenos Aires',
        localidad: 'Comuna 10',
        barrio: 'Floresta',
        subbarrio: 'Monte Castro',
        codigopostal: '1417'
      };
    }
    this.buildForm();
    // this.formulario.valueChanges.subscribe(data => {
    //   console.log(this.formulario);
    // });
  }

  buildForm() {
    this.formAviso = this.formBuilder.group({
      calle: [this.defaultForm.calle, [Validators.required, Validators.minLength(5)]],
      altura: [this.defaultForm.altura, [Validators.required, Validators.pattern('[0-9]{1,5}')]],
      piso: [this.defaultForm.piso, [Validators.pattern('[0-9]{1,5}')]],
      depto: [this.defaultForm.depto, [Validators.pattern('[a-z][A-Z][0-9]{1,5}')]],
      tipo_inmueble: [this.defaultForm.tipo_inmueble, [Validators.required]],
      tipo_unidad: [this.defaultForm.tipo_unidad],
      tipo_operacion: [this.defaultForm.tipo_operacion, [Validators.required]],
      titulo: [this.defaultForm.titulo, [Validators.required, Validators.minLength(10)]],
      descripcion: [this.defaultForm.descripcion, [Validators.required, Validators.minLength(100)]],
      precio: [this.defaultForm.precio, [Validators.required, Validators.pattern('[0-9]{1,10}')]],
      radiogroup_moneda: [this.defaultForm.radiogroup_moneda, Validators.required],
      no_publicar_precio: [this.defaultForm.no_publicar_precio, Validators.required],
      apto_credito: [this.defaultForm.apto_credito, Validators.required],
      pais: [this.defaultForm.pais, [Validators.required, Validators.minLength(3)]],
      provincia: [this.defaultForm.provincia, [Validators.required, Validators.minLength(5)]],
      partido: [this.defaultForm.partido, [Validators.required, Validators.minLength(5)]],
      localidad: [this.defaultForm.localidad, [Validators.required, Validators.minLength(5)]],
      barrio: [this.defaultForm.barrio, [Validators.required, Validators.minLength(5)]],
      subbarrio: [this.defaultForm.subbarrio, [Validators.required, Validators.minLength(5)]],
      codigopostal: [this.defaultForm.codigopostal, [Validators.required, Validators.pattern('[A-Za-z0-9]{4,10}')]]
    });
  }

  guardarCambios() {
    if (this.formAviso.valid) {
      this.formService.formAviso = this.formAviso;
      this.submitForm.emit('formularioValidado');
    }
  }

  // segun los valores ingresados en el select Tipo de inmbueble, se llena el select Tipo de Unidad.
  checkForFills(i: number, e) {
    const idControl = i;
    const idOption = e.target.selectedIndex;
    // tslint:disable-next-line:whitespace
    if (
      (typeof this.formControls.controls[idControl] !== 'undefined') &&
      (typeof this.formControls.controls[idControl].value[idOption] !== 'undefined')
    ) {
      if (typeof this.formControls.controls[idControl].value[idOption].fill === 'undefined') {
        console.log('No hay controles para llenar');
      } else {

        console.log('llenando del control', this.formControls.controls[idControl].value[idOption].fill.fill_control);
        console.log('con los siguientes valores: ', this.formControls.controls[idControl].value[idOption].fill.value);

        const fill = this.formControls.controls[idControl].value[idOption].fill;
        const selectToFill = document.getElementById(fill.fill_control) as HTMLSelectElement;
        const insertOption = document.createElement('option');
        // LIMPIO EL SELECT A LLENAR
        for (let x = 0; x <= selectToFill.options.length; x++) {
          selectToFill.options[x] = null;
        }
        // lleno el select con los valores dentro de this.formControls.controls[idControl].value[idOption].fill.value
        let i = 0;
        fill.value.forEach(option => {
          selectToFill.options[i] = new Option(option.label, option.label);
          i++;
        });
      }
    }

  }

  noIgual(control: FormControl): any {
    console.log(this);
    const form: any = this;
    if (control.value !== form.controls.password1.value) {
      // if(control.value!==this.formControls.controls['password1'].value){
      return {
        noiguales: true
      };
    }
    return null;
  }

}
