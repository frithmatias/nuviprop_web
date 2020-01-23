import { Component, OnInit } from '@angular/core';
import { MisAvisosService, UploaderService, FormsService } from 'src/app/services/services.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Aviso } from 'src/app/models/aviso.model';


@Component({
	selector: 'app-aviso-crear',
	templateUrl: './aviso-crear.component.html',
	styles: [`
  .custom-dropzone{
    width: 100%;
    border: 1px dashed #cccccc;

  }
  .custom-dropzone-image{
    height: 50px;
    border: 1px dashed #cccccc;
  }

  `]
})
export class AvisoCrearComponent implements OnInit {

	parsetemplate = false;
	formValid = false;
	isLinear = false; // material stepper
	avisoId: string; // esta aviso la necesito para saber si tengo que mostrar el boton "Ver Publicación" en el template
	aviso: Aviso = new Aviso(); // Array de datos enviado al formulario hijo 'form-aviso

	ingresaDetalles = false; // viene del componente hijo formAvisos, indica cuando debe mostrarse el formDetalles
	ingresaDetallesData = {}; // cuando recibo de fromAvisos, tipooperacion y tipoinmueble los envio a formDetalles.

	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public misAvisosService: MisAvisosService,
		public uploaderService: UploaderService
	) { }

	ngOnInit() {
		this.misAvisosService.scrollTop();


		// Para los formularios dinamicos empiezo obteniendo los formularios para tipooperacion, tipoinmueble



		this.activatedRoute.params.subscribe(async params => {
			this.avisoId = params.id;
			if (this.avisoId) {
				if (this.avisoId === 'nuevo') {
					this.aviso.activo = false;  // muestra la ultima etapa para activar el aviso
					this.aviso.imgs = []; // elimina todas las imagenes cargadas en el uploader
					this.parsetemplate = true;
				} else {
					// EDICION
					await this.obtenerAviso(this.avisoId).then((data: Aviso) => {
						this.aviso = data;
						this.parsetemplate = true;
					});
				}
			}
		});
	}

	obtenerAviso(id: string) {
		return new Promise(resolve => {
			if (this.avisoId === 'nuevo') {
				resolve('No hay data es un aviso nuevo');
			} else {
				this.misAvisosService.obtenerAviso(id).subscribe((aviso: Aviso) => {
					resolve(aviso);
				});
			}
		});
	}

	guardarAviso(event, stepper) {
		// Desde el componente hijo (form.component.ts) recibo con un eventemitter que me notifica que
		// el formulario y sus datos son válidos, dejo una copia en el servicio que estalista para ser guardada.
		if (event.invalid) {
			return;
		}
		// this.aviso.inmobiliaria = f.value.inmobiliaria;

		this.misAvisosService
			.guardarAviso(event.value, this.avisoId) // Envío avisoId para saber si inserta ('nuevo') o actualiza ('id')
			.subscribe(resp => {
				this.aviso = resp.aviso;
				this.misAvisosService.stepperGoNext(stepper);

				// cambio url de /aviso/nuevo a /aviso/_id
				this.router.navigate(['/aviso-crear', resp.aviso._id]);
			});

	}

	stepperReset(stepper) {
		this.misAvisosService.stepperReset(stepper);
	}

	guardarDetalles(event, stepper) {
		// Desde el componente hijo (form.component.ts) recibo con un eventemitter que me notifica que
		// el formulario y sus datos son válidos, dejo una copia en el servicio que estalista para ser guardada.
		if (event.invalid) {
			return;
		}
		// this.aviso.inmobiliaria = f.value.inmobiliaria;

		this.misAvisosService
			// envío los valores del formulario detalles y el aviso obtenido del formulario AVISO
			.guardarDetalles(event.value, this.aviso).subscribe(resp => {
				this.aviso = resp.aviso;
				this.misAvisosService.stepperGoNext(stepper);
			});

	}

	setFormDetalles(event: any): void {
		console.log(event);
		// ingresaDetalles=true DEBE ejecutarse en el PADRE porque el resto de las operaciones NECESITAN
		// del formulario DETALLES, y esta DESHABILITADO al iniciarse el fomulario AVISO.

		// [HIJO]														[PADRE]
		// FORM AVISO 		-> {tipooperacion, tipoinmueble} 		-> AVISO-CREAR -> ingresaDetalles=true
		// FORM DETALLES 	<- {tipooperacion, tipoinmueble} 		<- AVISO-CREAR
		// FORM DETALLES 	-> formsService.obtenerFormControls()
		// 					-> OK	-> Fin
		// 					-> ERR	-> 								-> AVISO-CREAR -> ingresaDetalles=false
		//
		this.ingresaDetalles = true;
		this.ingresaDetallesData = event; // le envío al formuario detalles los datos de tipooperacion y tipoinmueble para fabricar mi formulario detalles
	}
}
