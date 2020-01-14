import { Component, OnInit } from '@angular/core';
import { MisAvisosService, UploaderService, FormsService } from 'src/app/services/services.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InmobiliariaService } from 'src/app/pages/inmobiliarias/inmobiliarias.service';
import { Aviso } from 'src/app/models/aviso.model';
import { Observable } from 'rxjs/internal/Observable';




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


	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public misAvisosService: MisAvisosService,
		public uploaderService: UploaderService
	) { }

	ngOnInit() {
		this.misAvisosService.scrollTop();
		this.activatedRoute.params.subscribe(params => {
			this.avisoId = params.id;
		});
		if (this.avisoId) {
			if (this.avisoId !== 'nuevo') {
				this.obtenerAviso(this.avisoId).then((data: Aviso) => {
					this.aviso = data;
				});
			} else {

				this.aviso = {
					calle: 'Mercedes',
					altura: 2325,
					piso: 0,
					depto: '',
					tipoinmueble: { nombre: '', id: '', _id: '' },
					tipounidad: { nombre: '', id: '', _id: '' },
					tipooperacion: { nombre: '', id: '', _id: '' },
					titulo: 'Este es el titulo del aviso',
					descripcion: 'La descripcion tiene que ser larga debe superar los 50 caracteres para validar el control de lo contrario no se puede submitir.',
					precio: 490000,
					moneda: 'monedadolares',
					nopublicarprecio: true,
					aptocredito: false,
					provincia: { nombre: 'Ciudad de Buenos Aires', id: '' },
					departamento: { nombre: 'Comuna 10', id: '' },
					localidad: { nombre: '', id: '', _id: '' },
					coords: { lat: '', lng: '' },
					codigopostal: '1417'
				};

			}

		}
	}

	obtenerAviso(id: string) {
		return new Promise(resolve => {
			if (this.avisoId === 'nuevo') {
				resolve('No hay data es una aviso nueva');
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
				console.log('Guardado:', resp);
				this.aviso = resp.aviso;
				this.misAvisosService.stepperGoNext(stepper);
				this.router.navigate(['/aviso', resp.aviso._id]);
			});

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
				console.log('Guardado:', resp);
				this.aviso = resp.aviso;
				this.misAvisosService.stepperGoNext(stepper);
				this.router.navigate(['/aviso', resp.aviso._id]);
			});

	}
}
