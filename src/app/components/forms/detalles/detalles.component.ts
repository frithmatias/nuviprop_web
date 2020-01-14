import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService } from '../forms.service';
import { Detalles } from 'src/app/models/detalles.model';

@Component({
  selector: 'app-form-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {
  @Input() formData: Detalles;
  @Output() outputGroup: EventEmitter<FormGroup> = new EventEmitter();

  parsetemplate = false;
  propDetalles: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private formsService: FormsService
  ) { }

  ngOnInit() {
    this.buildForm().then(() => {
      console.log(this.formData);
      // formData contiene la data de la aviso que envía el componente padre
      this.propDetalles.patchValue({
        superficietotal: this.formData.superficietotal,
        superficieconstruible: this.formData.superficieconstruible,
        zonificacion: this.formData.zonificacion,
        longitudfondo: this.formData.longitudfondo,
        longitudfrente: this.formData.longitudfrente,
        tipoterreno: this.formData.tipoterreno,
        fot: this.formData.fot,
        fos: this.formData.fos,
        tipopendiente: this.formData.tipopendiente,
        tipovista: this.formData.tipovista,
        tipocosta: this.formData.tipocosta,
        estado: this.formData.estado,
        propiedadocupada: this.formData.propiedadocupada,
        fondoirregular: this.formData.fondoirregular,
        frenteirregular: this.formData.frenteirregular,
        demolicion: this.formData.demolicion,
        lateralizquierdoirregular: this.formData.lateralizquierdoirregular,
        lateralderechoirregular: this.formData.lateralderechoirregular,
        instalaciones: this.formData.instalaciones,
        servicios: this.formData.servicios,
      });
      this.parsetemplate = true;
      console.log(this.propDetalles);
    }
    );


  }


  buildForm() {
    return new Promise(resolve => {
      this.propDetalles = this.formBuilder.group({

        superficietotal: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
        superficieconstruible: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
        zonificacion: ['', [Validators.required]],
        longitudfondo: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
        longitudfrente: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
        tipoterreno: ['', [Validators.required, Validators.minLength(5)]],
        fot: ['', [Validators.required]],
        fos: ['', [Validators.required]],
        tipopendiente: ['', [Validators.required, Validators.minLength(5)]],
        tipovista: ['', [Validators.required, Validators.minLength(5)]],
        tipocosta: ['', [Validators.required, Validators.minLength(5)]],
        estado: ['', [Validators.required, Validators.minLength(5)]],
        propiedadocupada: ['', [Validators.required]],
        fondoirregular: ['', [Validators.required]],
        frenteirregular: ['', [Validators.required]],
        demolicion: ['', [Validators.required]],
        lateralizquierdoirregular: ['', [Validators.required]],
        lateralderechoirregular: ['', [Validators.required]],
        instalaciones: ['', [Validators.required]],
        servicios: ['', [Validators.required]],











      });
      resolve();
    });
  }


  enviarFormulario() {
    console.log(this.propDetalles.value);
    if (this.propDetalles.valid) {
      this.outputGroup.emit(this.propDetalles);
    } else {
      this.openSnackBar('Faltan datos, por favor verifique.', 'Aceptar');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


}
