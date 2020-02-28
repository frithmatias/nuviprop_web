import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Aviso } from 'src/app/models/aviso.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService } from '../../../services/forms.service';
import { TipoInmueble } from 'src/app/models/aviso_tipoinmueble.model';
import { TipoUnidad, TiposUnidades } from 'src/app/models/aviso_tipounidad.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';
import { TipoOperacion } from 'src/app/models/aviso_tipooperacion.model';
import { Localidad } from 'src/app/models/localidad.model';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';

@Component({
	selector: 'app-form-aviso',
	templateUrl: './aviso.component.html',
	styleUrls: ['./aviso.component.scss']
})
export class AvisoComponent implements OnInit {
	// Si estoy editando una aviso obtengo los datos en formData
	@Input() formData: Aviso;
	@Output() formReady: EventEmitter<FormGroup> = new EventEmitter();
	@Output() setFormDetalles: EventEmitter<object> = new EventEmitter();
	parsetemplate = false;
	avisoId: string;
	formAviso: FormGroup = new FormGroup({});
	unidades: TipoUnidad[] = [];
	// Le paso al componente child app-mapa las coordenadas de la localidad seleccionada
	centerMap: number[] = [];

	// Para definir cual va a ser mi formulario de detalles necesito los ID de tipooperacion y tipoinmueble
	tipooperacion: string;
	tipoinmueble: string;

	// Localidades
	localidadesControl = new FormControl();
	filteredOptions: Observable<string[]>;
	options: any[] = [];

	// FLAG AVISO CARGADO, me permite cargar las coordenadas del aviso la primera vez, luego escucha el 
	// control de localidad para cargar las coordenadas de la localidad si se cambia la localidad.
	avisoCargado = false;
	constructor(
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar,
		public formsService: FormsService,
		private activatedRoute: ActivatedRoute,
		private capitalizarPipe: CapitalizarPipe
	) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.avisoId = params.id;
			this.buildForm();

			if (params.id) {
				if (params.id === 'nuevo') {
					this.formAviso.reset();
				} else {

					// si es una EDICION tengo que enviar al padre el tipooperacion y tipoinmueble
					// para que construya y muestre (ingresaDetalles=true) el formulario de detalles
					// esto lo hace el metodo setFormDetalles() en el padre (aviso-crear.component.ts)
					if (this.formData.tipooperacion && this.formData.tipoinmueble) {
						this.emitFormDetalles(this.formData.tipooperacion._id, this.formData.tipoinmueble._id);
						this.tipooperacion = this.formData.tipooperacion._id;
						this.tipoinmueble = this.formData.tipoinmueble._id;
						this.centerMap = [Number(this.formData.coords.lng), Number(this.formData.coords.lat)];
						this.formsService.localidadesControl.setValue(this.formData.localidad);
					}
				}
			}
		});

		this.filteredOptions = this.localidadesControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filter(value))
			);
	}


	// ngOnChanges(changes: SimpleChanges) {
	// 	// changes.prop contains the old and the new value...
	// }

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
		return new Promise((resolve, reject) => {
			this.formAviso = this.formBuilder.group({
				calle: ['', [Validators.required, Validators.minLength(5)]],
				altura: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
				piso: ['', [Validators.pattern('[0-9]{1,5}')]],
				depto: ['', [Validators.pattern('[A-Za-z0-9]{1,5}')]],
				titulo: ['', [Validators.required, Validators.minLength(10)]],
				descripcion: ['', [Validators.required, Validators.minLength(20)]],
				precio: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
				tipocambio: ['', [Validators.required]],
				publicarprecio: ['', [Validators.required]],
				aptocredito: ['', [Validators.required]],
				codigopostal: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{4,10}')]],
				tipoinmueble: ['', [Validators.required, Validators.minLength(5)]], // _id
				tipounidad: [null, [Validators.minLength(5)]], // _id
				tipooperacion: ['', [Validators.required, Validators.minLength(5)]], // _id
				localidad: ['', [Validators.required, Validators.minLength(5)]], // _id
				lat: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(5)]],
				lng: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(5)]]
			});
			// COMO ANGULAR NO HACE VALIDACIONES SOBRE CONTROLES 'DISABLED', HAGO UNA VALIDACION A NIVEL FORMULARIO
			this.formAviso.setValidators(this.validarLatLng.bind(this));

			// evita el _id of null
			const tipooperacionValor = this.formData.tipooperacion ? this.formData.tipooperacion._id : null;
			const tipoinmuebleValor = this.formData.tipoinmueble ? this.formData.tipoinmueble._id : null;
			const tipounidadValor = this.formData.tipounidad ? this.formData.tipounidad._id : null;
			const localidadValor = this.formData.localidad ? this.formData.localidad._id : null;

			if (this.avisoId !== 'nuevo') {

				this.formAviso.setValue({
					calle: this.formData.calle,
					altura: this.formData.altura,
					piso: this.formData.piso,
					depto: this.formData.depto,
					titulo: this.formData.titulo,
					descripcion: this.formData.descripcion,
					precio: this.formData.precio,
					tipocambio: this.formData.tipocambio,
					publicarprecio: this.formData.publicarprecio,
					aptocredito: this.formData.aptocredito,
					codigopostal: this.formData.codigopostal,
					tipooperacion: tipooperacionValor,
					tipoinmueble: tipoinmuebleValor,
					tipounidad: tipounidadValor,
					localidad: localidadValor,
					lat: this.formData.coords.lat,
					lng: this.formData.coords.lng
				});
			}


			resolve();
		});

	}

	validarLatLng(form: FormGroup) {
		if (!form.controls.lng || !form.controls.lat) {
			return { error: 'Debe ingresar la posición en el mapa!' };
		}
		return null;
	}

	snack(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 2000,
		});
	}

	setOperacion(operacion: TipoOperacion) {
		this.tipooperacion = operacion._id;
		if (this.tipooperacion && this.tipoinmueble) {
			this.emitFormDetalles(this.tipooperacion, this.tipoinmueble);
		}
	}

	emitFormDetalles(tipooperacion: string, tipoinmueble: string) {
		// Le envío al componente padre (aviso-crear) los datos necesarios para fabricar el formulario Detalles
		this.setFormDetalles.emit({
			tipooperacion,
			tipoinmueble
		});
	}

	checkForFills(inmueble: TipoInmueble) {
		this.tipoinmueble = inmueble._id;
		if (this.tipooperacion && this.tipoinmueble) {
			this.emitFormDetalles(this.tipooperacion, this.tipoinmueble);
		}

		// http://localhost:3000/inicio/unidades/tipoinmueble_departamento
		this.formsService.obtenerUnidades(inmueble.id).subscribe((data: TiposUnidades) => {
			if (data.unidades.length > 0) {
				this.unidades = data.unidades;
			} else {
				this.unidades = [];
				// Si estoy EDITANDO un aviso, y cambio de un inmueble que tenía unidades a otro que
				// no tiene unidades, tengo que resetear y poner a null ese dato.
				this.formAviso.patchValue({
					tipounidad: null
				});
			}
		});
	}

	setLocalidad(localidad: Localidad) {
		this.centerMap = localidad.geometry.coordinates;
		this.formAviso.patchValue({
			localidad: localidad._id
		});
	}

	getInputLocalidadNombre(value: any) {
		if (value) {
			const capval = this.capitalizarPipe.transform(value.properties.nombre);
			return capval;
		}
	}

	enviarFormulario() {
		console.log(this.formAviso);
		if (this.formAviso.valid) {
			this.formReady.emit(this.formAviso.getRawValue()); // envio raw para que incluya los value de los controles disabled.
		} else {
			if (this.formAviso.errors && this.formAviso.errors.error) {
				this.snack(this.formAviso.errors.error, 'Aceptar');
			} else {
				this.snack('Faltan datos, por favor verifique.', 'Aceptar');
			}
		}
	}

	setCoords(e) {
		this.formAviso.patchValue({
			lat: String(e.lat),
			lng: String(e.lng)
		});
	}
}
