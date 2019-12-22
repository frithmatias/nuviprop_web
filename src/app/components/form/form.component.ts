import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormService } from './form.service';
import { FormularioData, respForm } from 'src/app/models/form.model';
import { parse } from 'querystring';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  parsetemplate = false;
  formsGroups: FormGroup[] = [];


  @Input() formGroup: FormGroup; // recibo la configuración del formulario
  @Input() formControls: FormularioData;
  @Input() propId: string;
  @Output() submitForm: EventEmitter<FormGroup> = new EventEmitter();

  constructor(private formService: FormService) {
  }

  ngOnInit() {
    console.log('formGroup: ', this.formGroup);
    console.log('formControls: ', this.formControls);
    this.parsetemplate = true;
    // this.formulario.valueChanges.subscribe(data => {
    //   console.log(this.formulario);
    // });


  }



  enviarFormulario(formName) {
    if (this.formGroup.valid) {
      this.submitForm.emit(this.formGroup);
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

        console.log('llenando del control', this.formControls.controls[idControl].value[idOption].fill.fillControl);
        console.log('con los siguientes valores: ', this.formControls.controls[idControl].value[idOption].fill.value);

        const fill = this.formControls.controls[idControl].value[idOption].fill;
        const selectToFill = document.getElementById(fill.fillControl) as HTMLSelectElement;
        const insertOption = document.createElement('option');
        // LIMPIO EL SELECT A LLENAR
        for (let x = 0; x <= selectToFill.options.length; x++) {
          selectToFill.options[x] = null;
        }
        // lleno el select con los valores dentro de form.controls[idControl].value[idOption].fill.value
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
      // if(control.value!==form.controls['password1'].value){
      return {
        noiguales: true
      };
    }
    return null;
  }

}
