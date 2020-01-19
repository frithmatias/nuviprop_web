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
	aviso: Aviso = new Aviso();
	ingresaDetalles = false; // ingresa detalles SOLO para VENTA.


	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public misAvisosService: MisAvisosService,
		public uploaderService: UploaderService
	) { }

	ngOnInit() {
		this.misAvisosService.scrollTop();
		this.activatedRoute.params.subscribe(async params => {
			this.avisoId = params.id;
			if (this.avisoId) {
				if (this.avisoId !== 'nuevo') {
					await this.obtenerAviso(this.avisoId).then((data: Aviso) => {
						this.aviso = data;
						this.parsetemplate = true;
						if (data.tipooperacion.id === 'tipooperacion_venta') {
							this.ingresaDetalles = true;
						} else {
							this.ingresaDetalles = false;
						}
					});
				} else {
					// por defecto no se ingresan detalles a menos que al cargar una propiedad
					// se indique que corresponde a una VENTA.
					this.ingresaDetalles = false;
					this.aviso.activo = false;  // muestra la ultima etapa para activar el aviso
					this.aviso.imgs = []; // elimina todas las imagenes cargadas en el uploader

					this.parsetemplate = true;
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

				// cambio url de /nuevo a /aviso/idaviso
				this.router.navigate(['/aviso-crear', resp.aviso._id]);
			});

	}

	stepperReset(stepper) {
		this.misAvisosService.stepperReset(stepper);
	}

	guardarDetalles(event, stepper) {
		console.log(event, stepper);
		// Desde el componente hijo (form.component.ts) recibo con un eventemitter que me notifica que
		// el formulario y sus datos son válidos, dejo una copia en el servicio que estalista para ser guardada.
		if (event.invalid) {
			return;
		}
		// this.aviso.inmobiliaria = f.value.inmobiliaria;

		this.misAvisosService
			// envío el formulario y la aviso obtenida del formulario AVISO
			.guardarDetalles(event.value, this.aviso)
			.subscribe(resp => {
				this.aviso = resp.aviso;
				this.misAvisosService.stepperGoNext(stepper);
			});

	}
}
