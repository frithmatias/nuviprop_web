import { Component, OnInit } from '@angular/core';
import { MisAvisosService, UploaderService, FormsService } from 'src/app/services/services.index';
import { ActivatedRoute, Router } from '@angular/router';
import { Aviso } from 'src/app/models/aviso.model';


@Component({
	selector: 'app-aviso-crear',
	templateUrl: './aviso-crear.component.html',
	styleUrls: ['./aviso-crear.component.scss']

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
		this.activatedRoute.params.subscribe(async params => {
			this.avisoId = params.id;
			if (this.avisoId) {
				if (this.avisoId === 'nuevo') {
					// NUEVO AVISO
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
		if (event.invalid) {
			return;
		}
		this.misAvisosService
			.guardarAviso(event, this.avisoId) // Envío avisoId para saber si inserta ('nuevo') o actualiza ('id')
			.subscribe(resp => {
				this.aviso = resp.aviso;
				this.misAvisosService.stepperGoNext(stepper);
				this.router.navigate(['/aviso-crear', resp.aviso._id]);
			});

	}

	setFormDetalles(event: any): void {
		this.ingresaDetalles = true;
		this.ingresaDetallesData = event; // le envío al formuario detalles los datos de tipooperacion y tipoinmueble para fabricar mi formulario detalles
	}
	
	guardarDetalles(event, stepper) {
		if (event.invalid) {
			return;
		}
		this.misAvisosService.guardarDetalles(event.value, this.aviso).subscribe(resp => {
			this.aviso = resp.aviso;
			this.misAvisosService.stepperGoNext(stepper);
		});

	}

	stepperReset(stepper) {
		this.misAvisosService.stepperReset(stepper);
	}


}
