import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormsService } from '../../../services/forms.service';
import { Form, Control, Option } from 'src/app/models/form.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Aviso } from 'src/app/models/aviso.model';
import { TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';

@Component({
	selector: 'app-detalles',
	templateUrl: './detalles.component.html',
	styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit, OnChanges {
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


	ngOnChanges(changes: any) {
		if (changes.ingresaDetallesData) {
			const tipooperacion = changes.ingresaDetallesData.currentValue.tipooperacion;
			const tipoinmueble = changes.ingresaDetallesData.currentValue.tipoinmueble;
			this.formsService.obtenerFormControlsAndOptions(tipooperacion, tipoinmueble)
				.subscribe((data: Form) => {
					if (data) {
						this.controls = data.controls;
						// Construyo el group
						const group: any = {};
						this.controls.forEach(control => {
							group[control.id] = control.required ? new FormControl(this.formData.detalles ? this.formData.detalles[control.id] : '', Validators.required) : new FormControl('');
						});
						this.form = new FormGroup(group);
					} else {
						this.controls = [];
					}

				},
					(err) => {
						this.ingresaDetalles.emit(false); // muestro el formulario detalles en el STEPPER
					}
				);

		}
	}

	ngOnInit() {

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
