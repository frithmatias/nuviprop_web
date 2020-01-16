import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso } from 'src/app/models/aviso.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {
  @Input() formData: Aviso;
  @Output() formReady: EventEmitter<FormGroup> = new EventEmitter();
  avisoId: string;
  parsetemplate = false;
  formDetalles: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {


    this.activatedRoute.params.subscribe(async params => {
      this.avisoId = params.id;
      if (params.id) {
        if (params.id === 'nuevo') {
          this.formData = {};
          this.formDetalles.reset({});
        }
      }
    })

    this.buildForm().then(() => {
      // formData contiene la data del aviso que envía el componente padre
      this.parsetemplate = true;
    }
    );


  }


  buildForm() {
    return new Promise(resolve => {

      this.formDetalles = this.formBuilder.group({
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

      if (this.avisoId !== 'nuevo') {
        this.formDetalles.setValue({
          superficietotal: this.formData.detalles.superficietotal,
          superficieconstruible: this.formData.detalles.superficieconstruible,
          zonificacion: this.formData.detalles.zonificacion,
          longitudfondo: this.formData.detalles.longitudfondo,
          longitudfrente: this.formData.detalles.longitudfrente,
          tipoterreno: this.formData.detalles.tipoterreno,
          fot: this.formData.detalles.fot,
          fos: this.formData.detalles.fos,
          tipopendiente: this.formData.detalles.tipopendiente,
          tipovista: this.formData.detalles.tipovista,
          tipocosta: this.formData.detalles.tipocosta,
          estado: this.formData.detalles.estado,
          propiedadocupada: this.formData.detalles.propiedadocupada,
          fondoirregular: this.formData.detalles.fondoirregular,
          frenteirregular: this.formData.detalles.frenteirregular,
          demolicion: this.formData.detalles.demolicion,
          lateralizquierdoirregular: this.formData.detalles.lateralizquierdoirregular,
          lateralderechoirregular: this.formData.detalles.lateralderechoirregular,
          instalaciones: this.formData.detalles.instalaciones,
          servicios: this.formData.detalles.servicios
        })
      }
      console.log('formDetalles:', this.formDetalles)
    })

  }

  enviarFormulario() {
    if (this.formDetalles.valid) {
      this.formReady.emit(this.formDetalles);
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
