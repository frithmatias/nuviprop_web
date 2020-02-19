import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { FormsService } from 'src/app/services/forms.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
	selector: 'app-controles',
	templateUrl: './controles.component.html',
	styleUrls: ['./controles.component.scss']
})
export class ControlesComponent implements OnInit {

	constructor(
		public formsService: FormsService,
		private snackBar: MatSnackBar,
		private router: Router
	) { }

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
	ngOnInit() {
		this.buildForm();
		this.formNewControl.valueChanges.subscribe(data => {
			if (this.hasOptionsControls.includes(data.type)) {
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


	// Construye el formulario
	buildForm() {
		this.formNewControl.addControl('nombre', new FormControl('', Validators.required));
		this.formNewControl.addControl('id', new FormControl('', Validators.required));
		this.formNewControl.addControl('type', new FormControl('', Validators.required));
		this.formNewControl.addControl('opciones', new FormArray([new FormControl('', [Validators.required])]));
		this.formNewControl.addControl('required', new FormControl(false, Validators.required));
		this.formNewControl.setValidators(this.validarArray.bind(this.formNewControl));
	}

	// [Validators.required, this.requireMatch(this.accessCodeList).bind(this)]

	// validarArray(needOptions: boolean): ValidatorFn {
	// 	return (control: AbstractControl): ValidationErrors | null => {
	// 		if (control.value.length <= 1 && needOptions) {
	// 			return {
	// 				valorNoPermitido: true // validacion fallo
	// 			};
	// 		}
	// 		return null;
	// 	}
	// }


	validarArray(control: FormControl): any {
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
		// this.formNewControl.controls.opciones.controls[cantidadOpciones].setValidators(this.validarArray.bind(this.formNewControl));

	}

	enviarFormulario() {
		if (this.formNewControl.errors) {
			this.snackBar.open(this.formNewControl.errors.error, 'Aceptar', {
				duration: 2000,
			});
		} else if (this.formNewControl.invalid) {
			this.snackBar.open('Faltan datos por favor verifique.', 'Aceptar', {
				duration: 2000,
			});
		}



		if (this.formNewControl.valid) {
			this.formsService.createControl(this.formNewControl.value).subscribe(data => {
				if (data.ok) {
					this.snackBar.open('Control guardado correctamente.', 'Aceptar', {
						duration: 2000,
					}).afterDismissed().subscribe((snackdata) => {
						this.router.navigate(['/forms']);
					})
				} else {
					this.snackBar.open('¡Error! por favor intente mas tarde.', 'Aceptar', {
						duration: 2000,
					});
				}
			});
		}

	}



}
