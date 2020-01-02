import { Component, OnInit } from '@angular/core';
import { InicioService } from './inicio.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
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
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar
	) {

		this.formGroup = this.formBuilder.group({
			tipoinmueble:
			{
				nombre: '',
				id: ''
			},
			tipooperacion:
			{
				nombre: '',
				id: ''
			},
			localidad:
			{
				nombre: '',
				code: '',
				id: ''
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
		this.inicioService.obtenerOperaciones().subscribe((data: any) => {
			this.operaciones = data.operaciones;
		});
	}

	obtenerInmuebles() {
		this.inicioService.obtenerInmuebles().subscribe((data: any) => {
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

			this.inicioService.buscarLocalidad(pattern).subscribe((resp: Localidades) => {
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
	}

	cleanInput(element) {
		element.value = null;
		this.localidades = [];
	}

	enviarFormulario(element) {
		element.value = null;
		this.localidades = [];
		console.log(this.formGroup);

		if (this.formGroup.value.tipooperacion.id === '' || this.formGroup.value.tipoinmueble.id === '' || this.formGroup.value.localidad.id === '') {
			this.snackBar.open('Faltan datos, por favor verifique.', 'Aceptar', {
				duration: 2000,
			});
			return;
		}

		this.inicioService.buscarPropiedades(this.formGroup);

	}



}
