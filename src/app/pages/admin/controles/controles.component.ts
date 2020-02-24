import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { FormsService } from 'src/app/services/forms.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ControlDataResp } from 'src/app/models/form.model';

@Component({
	selector: 'app-controles',
	templateUrl: './controles.component.html',
	styleUrls: ['./controles.component.scss']
})
export class ControlesComponent implements OnInit {

	showhelp = {
		etiqueta: false,
		identificador: false,
		tipocontrol: false,
		opciones: false,
		obligatorio: false
	}

	formNewControl: FormGroup = new FormGroup({});
	hasOptionsControls = ['select', 'select_multiple'];
	activateOptions = false;
	controlData: ControlDataResp;
	parseform = false;
	controlId: string;
	constructor(
		public formsService: FormsService,
		private snackBar: MatSnackBar,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	async ngOnInit() {
		// Si llega un ID como parametro, estoy intentando EDITAR un control
		this.activatedRoute.params.subscribe(async param => {
			if (param.id) {
				this.controlId = param.id;
				// busco la data del control y sus opciones si corresponde a un tipo select o select_multi
				await this.obtenerControlData(param.id).then(() => {
					this.parseform = true;
					this.buildForm();
				});
			} else {
				this.parseform = true;
				this.buildForm();
			}
		});



		this.formNewControl.valueChanges.subscribe(data => {
			if (this.hasOptionsControls.includes(data.type)) {
				// (tienen opciones los controles 'select' y 'select_multi')
				this.activateOptions = true;
			} else {
				this.activateOptions = false;
				if (this.formNewControl.controls.opciones) {
					// si no es un tipo SELECT, pero hay opciones cargadas significa que cargo opciones y volvio a una opcion sin opciones 
					// es decir selecciono un SELECT, cargo opciones, y luego cargo otro tipo de control sin opciones como un INPUT.
					const myArr: FormArray = this.formNewControl.controls.opciones as FormArray;
					myArr.clear();
					// myArr.clearValidators();
				}
			}
		});


	}

	// Si estoy editando un control obtengo su data y opciones
	obtenerControlData(id: string) {
		return new Promise((resolve, reject) => {
			this.formsService.obtenerControlData(id).subscribe((data: ControlDataResp) => {
				if (data.ok) {
					// si recibo data ok construyo mi array de opciones.
					console.log(data);
					this.controlData = data;
					resolve();
				} else {
					reject();
				}
			});
		});
	}

	// Construye el formulario
	buildForm() {
		if (this.controlId) {
			// Si estoy editando un control adiciono un nuevo abastract control con la data de de cada opcion 
			// en la lista para enviarle los IDs de las opciones al backend.
			this.formNewControl.addControl('opcionesdata', new FormArray([new FormControl('')]));
		}
		this.formNewControl.addControl('nombre', new FormControl(this.controlData ? this.controlData.control.nombre : '', Validators.required));
		this.formNewControl.addControl('id', new FormControl(this.controlData ? { value: this.controlData.control.id, disabled: true } : '', Validators.required));
		this.formNewControl.addControl('type', new FormControl(this.controlData ? this.controlData.control.type : '', Validators.required));
		this.formNewControl.addControl('opciones', new FormArray([new FormControl('', [Validators.required])]));
		this.formNewControl.addControl('required', new FormControl(this.controlData ? this.controlData.control.required : false, Validators.required));
		this.formNewControl.setValidators(this.validarArrayOpciones.bind(this.formNewControl));
		if (this.controlData && this.controlData.options) { this.fillFormArrayOptions(); } // select, select_multi
	}

	fillFormArrayOptions() {
		this.controlData.options.forEach(option => {

			// Este FormArray esta vinculado al formulario en el template y muestra las opciones para poder editarlas
			(this.formNewControl.controls.opciones as FormArray).push(
				new FormControl(option.nombre, [Validators.required])
			);
			// Este FormArray es virtual y guarda todos los metadatos de cada OPCIÓN.
			(this.formNewControl.controls.opcionesdata as FormArray).push(
				new FormControl(option, [Validators.required])
			);
		});
		(this.formNewControl.controls.opcionesdata as FormArray).removeAt(0);
		(this.formNewControl.controls.opciones as FormArray).removeAt(0);

		// -> opcionesdata: (8) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
		// nombre: "Orientacion"
		// id: "orientacion"
		// type: "select"
		// -> opciones: (8) ["Norte", "Noreste", "Noroeste", "Sur", "Sureste", "Suroeste", "Este", "Oeste"]
		// required: true

	}
	// [Validators.required, this.requireMatch(this.accessCodeList).bind(this)]

	// validarArrayOpciones(needOptions: boolean): ValidatorFn {
	// 	return (control: AbstractControl): ValidationErrors | null => {
	// 		if (control.value.length <= 1 && needOptions) {
	// 			return {
	// 				valorNoPermitido: true // validacion fallo
	// 			};
	// 		}
	// 		return null;
	// 	}
	// }


	validarArrayOpciones(control: FormControl): any {
		// control represeta el control desde el cual el validador es invocado, en este caso es formGroup.
		const forma: any = this;
		if ((['select', 'select_multiple'].includes(forma.controls.type.value)) && (forma.controls.opciones.controls.length < 2)) {
			return { error: 'Debe ingresar al menos dos opciones para el control' }
		}
		return null;
	}

	validarNombre(control: FormControl): { [s: string]: boolean } {
		if (control.value === 'novalido') {
			return { valorNoPermitido: true };  // validacion fallo
		}
		return null;
	}



	agregarOpcion() {
		// let cantidadOpciones: number;
		// if (this.formNewControl.controls.opciones) {
		// 	cantidadOpciones = this.formNewControl.controls.opciones.length;

		// }
		(this.formNewControl.controls.opciones as FormArray).push(
			new FormControl('', [Validators.required])
		);
		// this.formNewControl.controls.opciones.controls[cantidadOpciones].setValidators(this.validarArrayOpciones.bind(this.formNewControl));

	}

	enviarFormulario() {

		console.log(this.formNewControl);
		if (this.formNewControl.errors) {
			this.snackBar.open(this.formNewControl.errors.error, 'Aceptar', {
				duration: 2000,
			});
		}

		if (this.formNewControl.invalid) {
			this.snackBar.open('Faltan datos por favor verifique.', 'Aceptar', {
				duration: 2000,
			});
		}

		if (this.formNewControl.valid) {
			// Si se trata de una edición, envío como segundo parámetro el idcontrol.
			this.formsService.createControl(this.formNewControl.value, this.controlId).subscribe(data => {
				if (data.ok) {
					console.log(data);
					this.snackBar.open('Control guardado correctamente.', 'Aceptar', {
						duration: 2000,
					}).afterDismissed().subscribe((snackdata) => {
						this.router.navigate(['/forms']);
					});
				} else {
					this.snackBar.open('¡Error! por favor intente mas tarde.', 'Aceptar', {
						duration: 2000,
					}).afterDismissed().subscribe((snackdata) => {
						this.router.navigate(['/forms']);
					});
				}
			});

		}

	}



}
