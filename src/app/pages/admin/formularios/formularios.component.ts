import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/services.index';
import { TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { TipoInmueble } from 'src/app/models/aviso_tipoinmueble.model';
import { Control, Form } from 'src/app/models/form.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-formularios',
	templateUrl: './formularios.component.html',
	styleUrls: ['./formularios.component.scss']
})
export class FormulariosComponent implements OnInit {
	formSettings: FormGroup = new FormGroup({});
	controls: Control[];
	tipooperacion: string;
	tipoinmueble: string;
	parsetemplate = false;
	constructor(public formsService: FormsService) { }

	ngOnInit() {
		this.obtenerControlesTodos();
	}

	// Muestra TODOS los controles posibles
	obtenerControlesTodos() {
		this.formsService.getAllControls().subscribe((data: Form) => {
			this.controls = data.controls;
			this.buildForm();
			this.parsetemplate = true;
			// al group ademas de los controles, les voy a sumar los controles propios del formulario "Aviso"
			// tipooperacion y tipoinmueble, porque son los datos que tengo que definir para los controles en la BD.
		},
			(err) => {
			}
		);
	}

	// Setea la opcion de operacion
	setOperacion(operacion: TipoOperacion) {
		this.tipooperacion = operacion._id;
		this.formSettings.controls.tipooperacion.patchValue(operacion._id);
		if (this.tipooperacion && this.tipoinmueble && this.controls) {
			this.patchValues();
		}
	}

	// Setea la opcion del tipo de inmueble
	setInmueble(inmueble: TipoInmueble) {
		this.tipoinmueble = inmueble._id;
		this.formSettings.controls.tipoinmueble.patchValue(inmueble._id);
		if (this.tipooperacion && this.tipoinmueble && this.controls) {
			this.patchValues();
		}
	}

	// Si estan seteados los controles, la operacion y el inmueble, entonces envía los datos.
	patchValues() {
		this.formsService.obtenerFormControls(this.tipooperacion, this.tipoinmueble).subscribe((formulario: any) => {
			// formulario:
			// _id: "5e2ca40c35594512e42ac56e"
			// controls: (21) ["5e2704cce13bdf0c315eb307", ... , "5e2725ece13bdf0c315ecfef"]
			// tipooperacion: "5e04b4bd3cb7d5a2401c9895"
			// tipoinmueble: "5e04bf7a3cb7d5a2401c9b15"

			if (formulario !== undefined) {
				this.controls.forEach(control => {
					if (formulario.controls.includes(control._id)) {
						this.formSettings.controls[control._id].patchValue(true);
					} else {
						this.formSettings.controls[control._id].patchValue(false);
					}
				});
			} else {
				this.formSettings = new FormGroup({});
				this.buildForm(this.tipooperacion, this.tipoinmueble);

			}
		});
	}

	// Construye el formulario
	buildForm(tipooperacion?: string, tipoinmueble?: string) {
		const group: any = {}; // controls object
		this.controls.forEach(control => {
			group[control._id] = new FormControl(false); // false default value
		});
		this.formSettings = new FormGroup(group); // build group
		this.formSettings.addControl('tipooperacion', new FormControl(tipooperacion ? this.tipooperacion : '', Validators.required));
		this.formSettings.addControl('tipoinmueble', new FormControl(tipoinmueble ? this.tipoinmueble : '', Validators.required));
	}

	enviarFormulario() {
		if (this.formSettings.valid) {
			const activatedControls = [];

			// Verifico que controles estan activados y los meto en un array para enviarlos.
			Object.keys(this.formSettings.controls).forEach(key => {
				if (this.formSettings.controls[key].value === true) {
					activatedControls.push(key);
				}
				// this.form.get(key).markAsDirty();
			});

			// Envío el array activatedControls.
			this.formsService.setFormControls({
				tipooperacion: this.tipooperacion,
				tipoinmueble: this.tipoinmueble,
				controls: activatedControls
			}).subscribe((data: any) => {
				if (data.ok) {
					Swal.fire('Guardado!', 'La configuración del formulario fue guardada en forma exitosa.', 'success');
				} else {
					Swal.fire('Error!', 'Hubo un error al guardar la configuración del formulario, por favor reintente mas tarde.', 'error');
				}
			});
		}
	}
}
