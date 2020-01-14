import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Aviso } from 'src/app/models/aviso.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService } from '../forms.service';
import { TipoInmueble } from 'src/app/models/aviso_tipoinmueble.model';
import { TipoUnidad, TiposUnidades } from 'src/app/models/aviso_tipounidad.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
	selector: 'app-form-aviso',
	templateUrl: './aviso.component.html',
	styleUrls: ['./aviso.component.scss']
})
export class AvisoComponent implements OnInit {
	// Si estoy editando una aviso obtengo los datos en formData
	@Input() formData: Aviso;
	@Output() outputGroup: EventEmitter<FormGroup> = new EventEmitter();
	@Output() ingresaDetalles: EventEmitter<Boolean> = new EventEmitter();
	value = 'Clear me';
	parsetemplate = false;
	propId: string;
	formGroup: FormGroup = new FormGroup({});

	// operaciones e inmuebles no cambian, son siempre los mismos en todo el scope de la web por lo tanto 
	// las obtengo una única vez al iniciar el servicio FORMS. Desde las vistas las obtengo llamando directamente 
	// al servicio formsService.operaciones y formsService.inmuebles.
	// operaciones:
	// inmuebles:
	unidades: TipoUnidad[] = [];

	// Localidades
	localidadesControl = new FormControl();
	filteredOptions: Observable<string[]>;
	options: any[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar,
		private formsService: FormsService
	) { }

	ngOnInit() {
		this.buildForm().then(() => {
			// formData contiene la data de la aviso que envía el componente padre
			this.formGroup.patchValue({
				calle: this.formData.calle,
				altura: this.formData.altura,
				piso: this.formData.piso,
				depto: this.formData.depto,
				tipoinmueble: { nombre: this.formData.tipoinmueble.nombre, _id: this.formData.tipoinmueble._id },
				tipounidad: { nombre: this.formData.tipounidad.nombre, _id: this.formData.tipounidad._id },
				tipooperacion: { nombre: this.formData.tipooperacion.nombre, _id: this.formData.tipooperacion._id },
				titulo: this.formData.titulo,
				descripcion: this.formData.descripcion,
				precio: this.formData.precio,
				moneda: this.formData.moneda,
				nopublicarprecio: this.formData.nopublicarprecio,
				aptocredito: this.formData.aptocredito,
				provincia: { nombre: this.formData.provincia.nombre, id: this.formData.provincia.id },
				departamento: { nombre: this.formData.departamento.nombre, id: this.formData.departamento.id },
				localidad: { nombre: this.formData.localidad.nombre, id: this.formData.localidad.id, _id: this.formData.localidad._id },
				coords: { lat: this.formData.coords.lat, lng: this.formData.coords.lng },
				codigopostal: this.formData.codigopostal
			});
			this.parsetemplate = true;
		}
		);

		this.filteredOptions = this.localidadesControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filter(value))
			);
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
		return new Promise(resolve => {
			// El valor por defecto '' en este caso NO es necesario, porque yo no estoy trabajando
			// con un objeto 'aviso', estoy trabajando DIRECTAMENTE con el objeto formGroup.value
			// en donde yo guardo la data de la aviso, y desde donde los controles en el formulario
			// van a buscar la data.

			// En general la configuración sería
			// [value]="aviso.titulo" -> aviso.titulo <- formGroup.value.titulo

			// En este caso utilizo el metodo patchValue({...}) para guardar la data en mi formGroup
			// [value]="formGroup.value.titulo" <-> formGroup.value.titulo
			this.formGroup = this.formBuilder.group({
				calle: ['', [Validators.required, Validators.minLength(5)]],
				altura: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
				piso: ['', [Validators.pattern('[0-9]{1,5}')]],
				depto: ['', [Validators.pattern('[a-z][A-Z][0-9]{1,5}')]],
				tipoinmueble:
				{
					nombre: ['', [Validators.required, Validators.minLength(5)]],
					id: ['', [Validators.required, Validators.minLength(5)]],
					_id: ['', [Validators.required, Validators.minLength(5)]],

				},
				tipounidad:
				{
					nombre: ['', [Validators.required, Validators.minLength(5)]],
					id: ['', [Validators.required, Validators.minLength(5)]],
					_id: ['', [Validators.required, Validators.minLength(5)]],
				},
				tipooperacion:
				{
					nombre: ['', [Validators.required, Validators.minLength(5)]],
					id: ['', [Validators.required, Validators.minLength(5)]],
					_id: ['', [Validators.required, Validators.minLength(5)]],
				},
				titulo: ['', [Validators.required, Validators.minLength(10)]],
				descripcion: ['', [Validators.required, Validators.minLength(100)]],
				precio: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
				moneda: ['', [Validators.required]],
				nopublicarprecio: ['', [Validators.required]],
				aptocredito: ['', [Validators.required]],
				provincia:
				{
					nombre: ['', [Validators.required, Validators.minLength(5)]],
					id: ['', [Validators.required, Validators.minLength(5)]],

				},
				departamento:
				{
					nombre: ['', [Validators.required, Validators.minLength(5)]],
					id: ['', [Validators.required, Validators.minLength(5)]],

				},
				localidad:
				{
					nombre: ['', [Validators.required, Validators.minLength(5)]],
					id: ['', [Validators.required, Validators.minLength(5)]],
					_id: ['', [Validators.required, Validators.minLength(5)]],

				},
				coords:
				{
					lat: ['', [Validators.required, Validators.minLength(5)]],
					lng: ['', [Validators.required, Validators.minLength(5)]],

				},
				codigopostal: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{4,10}')]]
			});
			resolve();
		});
	}

	enviarFormulario() {
		if (this.formGroup.valid) {
			this.outputGroup.emit(this.formGroup);
		} else {
			this.openSnackBar('Faltan datos, por favor verifique.', 'Aceptar');
		}
	}

	openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 2000,
		});
	}

	checkForFills(inmueble: TipoInmueble) {
		console.log(inmueble);
		//http://localhost:3000/inicio/unidades/tipoinmueble_departamento
		this.formsService.obtenerUnidades(inmueble.id).subscribe((data: TiposUnidades) => {
			this.unidades = data.unidades;
			console.log(this.unidades);
		});
	}

	checkOperacion(operacion) {
		if (operacion.id === 'venta') {
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
		this.formGroup.patchValue({
			localidad: {
				nombre: localidad.properties.nombre,
				id: localidad.properties.id,
				_id: localidad._id
			},
			departamento: {
				nombre: localidad.properties.departamento.nombre,
				id: localidad.properties.departamento.id,
			},
			provincia: {
				nombre: localidad.properties.provincia.nombre,
				id: localidad.properties.provincia.id,
			},
			coords: {
				lng: localidad.geometry.coordinates[0],
				lat: localidad.geometry.coordinates[1]
			},

		});
		console.log(this.formGroup);
	}
}
