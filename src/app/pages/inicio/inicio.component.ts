import { Component, OnInit } from '@angular/core';
import { InicioService } from './inicio.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService, PropiedadesService } from 'src/app/services/services.index';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar.pipe';

declare function init_plugins();

@Component({
	selector: 'app-inicio',
	templateUrl: './inicio.component.html',
	styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	// Control Autocomplete
	formGroup: FormGroup = new FormGroup({});
	nombreLocalidad: string = '';

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
		private snackBar: MatSnackBar,
		private capitalizarPipe: CapitalizarPipe,
		private propiedadesService: PropiedadesService
	) {

		this.formGroup = this.formBuilder.group({
			tipoinmueble: {},
			tipooperacion: {},
			localidad: {}
		});

	}

	ngOnInit() {
		init_plugins();
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
					resp.localidades.forEach(localidad => {
						localidad.properties.nombre = this.capitalizarPipe.transform(localidad.properties.nombre);
					})
					resolve(resp);
					return resp;
				}
			});
		});


	}

	setOperacion(tipooperacion: any, link?) {
		this.formGroup.patchValue({
			tipooperacion
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

	setInmueble(tipoinmueble) {
		this.formGroup.patchValue({
			tipoinmueble
		});
	}

	setLocalidad(localidad) {
		this.nombreLocalidad = this.localidadesControl.value.properties.nombre + ', ' + this.localidadesControl.value.properties.departamento.nombre + ', ' + this.localidadesControl.value.properties.provincia.nombre;

		console.log('Localidad seleccionada: ', localidad);
		console.log(this.localidadesControl);
		this.formGroup.patchValue({
			localidad: {
				_id: localidad._id,
				nombre: localidad.properties.nombre,
				id: localidad.properties.nombre.toLowerCase().replace(/ /g, '_')
			}
		});
		console.log('formGroup', this.formGroup);
	}

	cleanInput() {
		this.nombreLocalidad = '';
		this.localidadesControl.reset();
		this.localidades = [];
	}

	buscarPropiedades(element) {

		this.cleanInput();

		if (this.formGroup.value.localidad._id === '') {
			this.snackBar.open('Por favor ingrese una localidad.', 'Aceptar', {
				duration: 2000,
			});
			return;
		}

		// No necesito el objeto tal cual como lo recibo de la BD, solo extraigo de el una estructura 
		// básica igual a la del resto de los filtros. Esto tengo que hacerlo también cuando obtengo las 
		// localidades cercanas en el componente filtros.

		localStorage.setItem('filtros', JSON.stringify({
			tipooperacion: [JSON.stringify(this.formGroup.value.tipooperacion)],
			tipoinmueble: [JSON.stringify(this.formGroup.value.tipoinmueble)],
			localidad: [JSON.stringify(this.formGroup.value.localidad)]
		}));

		// obtenerPropiedades obtiene los filtros de la localStorage
		this.propiedadesService.obtenerPropiedades();
	}
}
