import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { Form, Control, Option } from 'src/app/models/form.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso } from 'src/app/models/aviso.model';

@Component({
	selector: 'app-detalles',
	templateUrl: './detalles.component.html',
	styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {
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
		this.formsService.obtenerFormControlsAndData(this.ingresaDetallesData.tipooperacion, this.ingresaDetallesData.tipoinmueble)
			.subscribe((data: Form) => {
				this.controls = data.controls;

				// Construyo el group
				const group: any = {};
				this.controls.forEach(control => {
					group[control.id] = control.required ? new FormControl(this.formData.detalles ? this.formData.detalles[control.id] : '', Validators.required) : new FormControl('');
				});
				this.form = new FormGroup(group);

			},
				(err) => {
					this.ingresaDetalles.emit(false); // muestro el formulario detalles en el STEPPER
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
