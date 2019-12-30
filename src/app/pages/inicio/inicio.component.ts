import { Component, OnInit } from '@angular/core';
import { InicioService } from './inicio.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
declare function init_plugins();
@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	// Control Autocomplete
	formGroup: FormGroup = new FormGroup({});
	operaciones: any[];
	inmuebles: any[];

	// Localidades
	localidadesControl = new FormControl();
	filteredOptions: Observable<string[]>;
	options: any[] = [];

	constructor(private inicioService: InicioService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {

		this.formGroup = this.formBuilder.group({
			tipoinmueble:
			{
				nombre: ['', [Validators.required, Validators.minLength(5)]],
				id: ['', [Validators.required, Validators.minLength(5)]]
			},
			tipooperacion:
			{
				nombre: ['', [Validators.required, Validators.minLength(5)]],
				id: ['', [Validators.required, Validators.minLength(5)]]
			},
			localidad:
			{
				nombre: ['', [Validators.required, Validators.minLength(5)]],
				code: ['', [Validators.required, Validators.minLength(5)]],
				id: ['', [Validators.required, Validators.minLength(5)]]
			}
		});

	}

	ngOnInit() {


		init_plugins();
		this.obtenerOperaciones();
		this.obtenerInmuebles();
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

	obtenerOperaciones() {
		this.inicioService.obtenerOperaciones().subscribe((data: any) => {
			this.operaciones = data.operaciones;
		});
	}

	obtenerInmuebles() {
		this.inicioService.obtenerInmuebles().subscribe((data: any) => {
			this.inmuebles = data.inmuebles;
		});
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
			// Con el fin de evitar sobrecargar al server con peticiones de datos duplicados, le pido al backend
			// que me envíe resultados SOLO cuando ingreso tres caracteres, a partir de esos resultados
			// el filtro lo hace el cliente en el frontend con los datos ya almacenados en this.options.


			this.inicioService.buscarLocalidad(event.target.value).subscribe((localidades: Localidades) => {
				if (localidades.ok) {
					this.options = [];
					localidades.localidades.forEach(localidad => {
						this.options.push(localidad);
					});
				}
			});
		}
	}

	setOperacion(operacion: any, link?) {
		this.formGroup.patchValue({
			tipooperacion: {
				nombre: operacion.nombre,
				id: operacion._id
			}
		});
		// dejo seleccionado el boton con la clase 'active'

		if (link) {
			const botones: any = document.getElementsByName('boton_tipo_operacion');
			// si la opcion se selecciono desde el select no existen botones
			// (cuando la pantalla es chica los botones desaparecen y aparece un select)
			for (const ref of botones) {
				ref.classList.remove('active');
			}
			link.classList.add('active');
		}
	}

	setInmueble(inmueble) {
		this.formGroup.patchValue({
			tipoinmueble: {
				nombre: inmueble.nombre,
				id: inmueble._id
			}
		});
		// En este metodo NO ES necesario hacer un patchValue() porque como se trata de un control SELECT
		// el dato se guarda automaticamente en el formulario (formGroup) al seleccionar una opción.
	}


	setLocalidad(localidad) {
		console.log(localidad);
		this.formGroup.patchValue({
			localidad: {
				nombre: `${localidad.properties.nombre}, ${localidad.properties.departamento.nombre}, ${localidad.properties.provincia.nombre}`,
				code: localidad.properties.id,
				id: localidad._id
			}
		});
		// Este metodo podría no ser necesario, pero tengo que enviar el nombre (string) al control
		// y el id (number) hacia un nuevo objeto que voy a enviar al backend. Esto es porque yo
		// necesito enviar el id, pero si guardo el ID en el form, en el control voy a ver el ID en lugar
		// del string localidad, departamento, provincia.
	}


	enviarFormulario() {

		if (this.formGroup.value.tipooperacion.id === '' || this.formGroup.value.tipoinmueble.id === '' || this.formGroup.value.localidad.id === '') {
			this.snackBar.open('Faltan datos, por favor verifique.', 'Aceptar', {
				duration: 2000,
			});
			return;
		}
		// Envío los datos obtenidos en el formulario a mi objeto con los datos a enviar al backend.


		// this.valuesToSearch.localidad:
		// [ esta seteado en el metodo setLocalidad() que se dispara al hacer click en una opcion del select de localidad]

		console.log(this.formGroup);
		// los valores de tipooperacion y tipoinmueble puedo sacarlos del formulario, pero la localidad no porque
		// viene de un INPUT TEXT y si yo intento guardar el valor ID en el fomulario (formGroup.value.localidad)
		// me va a mostrar el ID en el INPUT del formulario, y yo ahí quiero ver el nombre de localidad, dpto y pvcia.
		// Para eso creo un nuevo objeto para enviar localidad.propierties.nombre al INPUT y localidad.properties.id
		// al objeto. De esta manera en mi objeto tengo sólo los IDs de tipooperacion, tipoinmueble, localidad.
	}
}
