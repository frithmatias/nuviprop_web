import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormsService } from '../forms.service';
import { Form, Control, Option } from 'src/app/models/form.model';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso } from 'src/app/models/aviso.model';

@Component({
	selector: 'app-newforms',
	templateUrl: './newforms.component.html',
	styleUrls: ['./newforms.component.scss']
})
export class NewformsComponent implements OnInit {
	@Input() formData: Aviso;
	@Input() ingresaDetallesData: any = {}; // Se obtiene {tipooperacion:_id, tipoinmueble:_id} desde formAvisos
	@Output() ingresaDetalles: EventEmitter<boolean> = new EventEmitter();
	@Output() formReady: EventEmitter<FormGroup> = new EventEmitter();

	controls: Control[];
	form: FormGroup;

	constructor(
		private snackBar: MatSnackBar,
		private formsService: FormsService
	) { }

	ngOnInit() {
		console.log(this.ingresaDetallesData);
		this.formsService.obtenerFormControls('detalles', this.ingresaDetallesData.tipooperacion, this.ingresaDetallesData.tipoinmueble)
			.subscribe((data: Form) => {
				console.log(data);
				this.controls = data.controls;
				this.form = this.formsService.toFormGroup(this.controls, this.formData);
			},
				(err) => {
					this.ingresaDetalles.emit(false); // muestro el formulario detalles en el STEPPER
					console.log(err);
				}
			);
	}

	enviarFormulario() {
		if (this.form.valid) {
			this.formReady.emit(this.form);
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
