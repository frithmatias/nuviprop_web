import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Aviso } from 'src/app/models/aviso.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService } from '../forms.service';
import { TipoInmueble } from 'src/app/models/aviso_tipoinmueble.model';
import { TipoUnidad, TiposUnidades } from 'src/app/models/aviso_tipounidad.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-form-aviso',
	templateUrl: './aviso.component.html',
	styleUrls: ['./aviso.component.scss']
})
export class AvisoComponent implements OnInit {
	// Si estoy editando una aviso obtengo los datos en formData
	@Input() formData: Aviso;
	@Output() formReady: EventEmitter<FormGroup> = new EventEmitter();
	@Output() ingresaDetalles: EventEmitter<Boolean> = new EventEmitter(); // Selecciono VENTA, muestra form detalles.
	parsetemplate = false;
	avisoId: string;
	formAviso: FormGroup = new FormGroup({});
	unidades: TipoUnidad[] = [];

	// Localidades
	localidadesControl = new FormControl();
	filteredOptions: Observable<string[]>;
	options: any[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar,
		private formsService: FormsService,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe(async params => {
			this.avisoId = params.id;
			if (params.id) {
				if (params.id === 'nuevo') {
					this.formData = {};
					this.formAviso.reset({});
				}
			}
		})
		this.buildForm();
		this.filteredOptions = this.localidadesControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filter(value))
			);
	}

	ngOnChanges(changes: SimpleChanges) {
		// changes.prop contains the old and the new value...
	}

	private _filter(value: string): string[] {
		if (!value) {
			return;
		}
		const filterValue = value.toLowerCase();
		return this.options.filter((option: any) => {
			return option.properties.nombre.toLowerCase().includes(filterValue);
		});
	}

	buildForm() {
		console.log('formData', this.formData);
		this.formAviso = this.formBuilder.group({
			calle: ['', [Validators.required, Validators.minLength(5)]],
			altura: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
			piso: ['', [Validators.pattern('[0-9]{1,5}')]],
			depto: ['', [Validators.pattern('[A-Za-z0-9]{1,5}')]],
			titulo: ['', [Validators.required, Validators.minLength(10)]],
			descripcion: ['', [Validators.required, Validators.minLength(20)]],
			precio: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
			moneda: ['', [Validators.required]],
			nopublicarprecio: ['', [Validators.required]],
			aptocredito: ['', [Validators.required]],
			codigopostal: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{4,10}')]],
			tipoinmueble: ['', [Validators.required, Validators.minLength(5)]], //_id
			tipounidad: ['', [Validators.required, Validators.minLength(5)]], //_id
			tipooperacion: ['', [Validators.required, Validators.minLength(5)]], //_id
			localidad: ['', [Validators.required, Validators.minLength(5)]] //_id
		});


		this.formAviso.setValue({
			calle: this.formData.calle,
			altura: this.formData.altura,
			piso: this.formData.piso,
			depto: this.formData.depto,
			titulo: this.formData.titulo,
			descripcion: this.formData.descripcion,
			precio: this.formData.precio,
			moneda: this.formData.moneda,
			nopublicarprecio: this.formData.nopublicarprecio,
			aptocredito: this.formData.aptocredito,
			codigopostal: this.formData.codigopostal,
			tipoinmueble: this.formData.tipoinmueble._id,
			tipounidad: this.formData.tipounidad._id,
			tipooperacion: this.formData.tipooperacion._id,
			localidad: this.formData.localidad._id
		})

		console.log('formAviso:', this.formAviso)

	}


	openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 2000,
		});
	}

	checkForFills(inmueble: TipoInmueble) {
		//http://localhost:3000/inicio/unidades/tipoinmueble_departamento
		this.formsService.obtenerUnidades(inmueble.id).subscribe((data: TiposUnidades) => {
			this.unidades = data.unidades;
		});
	}

	checkOperacion(operacion) {
		// console.log(operacion);
		// _id: "5e04b4bd3cb7d5a2401c9895"
		// nombre: "Venta"
		// id: "tipooperacion_venta"
		// Si es venta emite true al padre para mostrar el formulario de carga de detalles del inmueble
		if (operacion.id === 'tipooperacion_venta') {
			this.ingresaDetalles.emit(true);
		} else {
			this.ingresaDetalles.emit(false);

		}
	}

	buscarLocalidad(event) {
		const regex = new RegExp(/^[a-z ñ0-9]+$/i);
		if (!regex.test(event.target.value) && event.target.value) {
			this.snackBar.open('¡Ingrese sólo caracteres alfanuméricos!', 'Aceptar', {
				duration: 2000,
			});
			return;
		}
		if (event.target.value.length === 3) {
			this.formsService.obtenerLocalidad(event.target.value).subscribe((localidades: Localidades) => {
				if (localidades.ok) {
					this.options = [];
					localidades.localidades.forEach(localidad => {
						this.options.push(localidad);
					});
				}
			});
		}
	}
	setLocalidad(localidad) {
		this.formAviso.patchValue({
			localidad: localidad._id
		});
	}

	enviarFormulario() {
		console.log(this.formAviso);
		if (this.formAviso.valid) {
			this.formReady.emit(this.formAviso);
		} else {
			this.openSnackBar('Faltan datos, por favor verifique.', 'Aceptar');
		}
	}
}
