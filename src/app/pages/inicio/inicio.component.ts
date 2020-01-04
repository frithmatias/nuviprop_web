import { Component, OnInit } from '@angular/core';
import { InicioService } from './inicio.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService } from 'src/app/services/services.index';

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


	// declaro mi nuevo control donde voy a capturar los datos ingresados para la busqueda.
	localidadesControl = new FormControl();
	// en localidades guardo los resultados de la busqueda de localidades cuando ingreso sólo 3 caracteres.
	localidades: any[] = [];
	// en filteredOptions filtro las opciones dentro de localidades segun el texto ingresado en el input de
	// busqueda de localidad y sólo cuando tiene mas de 3 caracteres, cuando tiene menos debe limpiarse.
	// filteredOptions: Observable<string[]>;
	filteredOptions: string[];

	constructor(
		private inicioService: InicioService,
		private formsService: FormsService,
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar
	) {

		this.formGroup = this.formBuilder.group({
			tipoinmueble:
			{
				nombre: '',
				_id: ''
			},
			tipooperacion:
			{
				nombre: '',
				_id: ''
			},
			localidad:
			{
				nombre: '',
				id: '',
				_id: ''
			}
		});

	}

	ngOnInit() {
		init_plugins();
		this.obtenerOperaciones();
		this.obtenerInmuebles();
		this.localidadesControl.valueChanges.subscribe(data => {
			if (typeof data !== 'string' || data.length <= 0) {
				return;
			}
			const filterValue = data.toLowerCase();
			if (data.length === 3) {
				this.buscarLocalidad(filterValue).then((resp: Localidades) => {
					resp.localidades.forEach(localidad => {
						this.localidades.push(localidad);
					});
				});
			} else if (data.length > 3) {
				this.localidades = this.localidades.filter((localidad: Localidad) => {
					return localidad.properties.nombre.toLowerCase().includes(filterValue);
				});
			}
		});
	}

	obtenerOperaciones() {
		this.formsService.obtenerOperaciones().subscribe((data: any) => {
			this.operaciones = data.operaciones;
		});
	}

	obtenerInmuebles() {
		this.formsService.obtenerInmuebles().subscribe((data: any) => {
			this.inmuebles = data.inmuebles;
		});
	}

	buscarLocalidad(pattern) {
		return new Promise((resolve, reject) => {
			const regex = new RegExp(/^[a-z ñ0-9]+$/i);
			if (!regex.test(pattern) && pattern) {
				this.snackBar.open('¡Ingrese sólo caracteres alfanuméricos!', 'Aceptar', {
					duration: 2000,
				});
				reject();
				return;
			}

			this.localidades = [];
			// Con el fin de evitar sobrecargar al server con peticiones de datos duplicados, le pido al backend
			// que me envíe resultados SOLO cuando ingreso tres caracteres, a partir de esos resultados
			// el filtro lo hace el cliente en el frontend con los datos ya almacenados en this.localidades.

			this.formsService.buscarLocalidad(pattern).subscribe((resp: Localidades) => {
				if (resp.ok) {
					resolve(resp);
					return resp;
				}
			});
		});


	}

	setOperacion(operacion: any, link?) {
		this.formGroup.patchValue({
			tipooperacion: {
				nombre: operacion.nombre,
				_id: operacion._id
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
				_id: inmueble._id
			}
		});
	}

	setLocalidad(localidad) {
		console.log('Localidad seleccionada: ', localidad);
		this.formGroup.patchValue({
			localidad: {
				nombre: localidad.properties.nombre,
				id: localidad.properties.id,
				_id: localidad._id
			}
		});
	}

	cleanInput(element) {
		element.value = null;
		this.localidades = [];
	}

	enviarFormulario(element) {
		element.value = null;
		this.localidades = [];
		console.log('Enviando formulario: ', this.formGroup);

		if (this.formGroup.value.tipooperacion._id === '' || this.formGroup.value.tipoinmueble._id === '' || this.formGroup.value.localidad._id === '') {
			this.snackBar.open('Faltan datos, por favor verifique.', 'Aceptar', {
				duration: 2000,
			});
			return;
		}

		this.formsService.obtenerPropiedades(this.formGroup);

	}



}
