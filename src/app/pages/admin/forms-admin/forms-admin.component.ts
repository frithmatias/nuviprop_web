import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/services.index';
import { TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { TipoInmueble } from 'src/app/models/aviso_tipoinmueble.model';
import { Control, Form } from 'src/app/models/form.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms-admin',
  templateUrl: './forms-admin.component.html',
  styleUrls: ['./forms-admin.component.scss']
})
export class FormsAdminComponent implements OnInit {
  formSettings: FormGroup = new FormGroup({});
  controls: Control[];
  tipooperacion: string;
  tipoinmueble: string;
  parsetemplate = false;
  constructor(public formsService: FormsService) { }

  ngOnInit() {
    this.obtenerControlesTodos();
  }

  checkOperacion(operacion: TipoOperacion) {
    this.tipooperacion = operacion._id;
    this.formSettings.controls.tipooperacion.patchValue(operacion._id);
    if (this.tipooperacion && this.tipoinmueble && this.controls) {
      this.setValues();
    }
  }

  checkInmueble(inmueble: TipoInmueble) {
    this.tipoinmueble = inmueble._id;
    this.formSettings.controls.tipoinmueble.patchValue(inmueble._id);
    if (this.tipooperacion && this.tipoinmueble && this.controls) {
      this.setValues();
    }
  }

  setValues() {
    this.formsService.obtenerFormControls(this.tipooperacion, this.tipoinmueble).subscribe((formulario: any) => {
      // ok: true
      // controls: (2) [{…}, {…}] <- controles 
      if (formulario !== undefined) {
        this.controls.forEach(control => {
          if (formulario.controls.includes(control._id)) {
            this.formSettings.controls[control._id].patchValue(true);
          } else {
            this.formSettings.controls[control._id].patchValue(false);
          }
        })
      } else {
        this.formSettings = new FormGroup({});
        this.buildForm(this.tipooperacion, this.tipoinmueble);

      }
    })
  }

  buildForm(tipooperacion?: string, tipoinmueble?: string) {
    this.formSettings = this.formsService.toFormGroup_Id(this.controls, null, false);
    this.formSettings.addControl('tipooperacion', new FormControl(tipooperacion ? this.tipooperacion : '', Validators.required));
    this.formSettings.addControl('tipoinmueble', new FormControl(tipoinmueble ? this.tipoinmueble : '', Validators.required));
  }

  obtenerControlesTodos() {
    this.formsService.getAllControls().subscribe((data: Form) => {
      this.controls = data.controls;
      this.buildForm();
      this.parsetemplate = true;
      // al group ademas de los controles, les voy a sumar los controles propios del formulario "Aviso"
      // tipooperacion y tipoinmueble, porque son los datos que tengo que definir para los controles en la BD.
    },
      (err) => {
        console.log(err);
      }
    );
  }

  enviarFormulario() {
    console.log(this.formSettings);
    if (this.formSettings.valid) {
      let activatedControls = [];
      Object.keys(this.formSettings.controls).forEach(key => {
        if (this.formSettings.controls[key].value === true) {
          activatedControls.push(key);
        }
        // this.form.get(key).markAsDirty();
		});

		    this.formsService.setFormControls({
		tipooperacion: this.tipooperacion,
		tipoinmueble: this.tipoinmueble,
		controls: activatedControls
		}).subscribe(data => {
		console.log(data);
		});
	}
  }
}
