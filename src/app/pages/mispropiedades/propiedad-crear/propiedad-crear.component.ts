import { Component, OnInit } from '@angular/core';
import { MisPropiedadesService, UploaderService, FormsService } from 'src/app/services/services.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InmobiliariaService } from 'src/app/pages/inmobiliarias/inmobiliarias.service';
import { Propiedad } from 'src/app/models/propiedad.model';
import { Observable } from 'rxjs/internal/Observable';




@Component({
	selector: 'app-propiedad-crear',
	templateUrl: './propiedad-crear.component.html',
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
export class PropiedadCrearComponent implements OnInit {

	parsetemplate = false;
	formValid = false;
	isLinear = false; // material stepper
	propId: string; // esta propiedad la necesito para saber si tengo que mostrar el boton "Ver Publicación" en el template
	propiedad: Propiedad = new Propiedad();


	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public misPropiedadesService: MisPropiedadesService,
		public uploaderService: UploaderService
	) { }

	ngOnInit() {
		this.misPropiedadesService.scrollTop();
		this.activatedRoute.params.subscribe(params => {
			this.propId = params.id;
		});
		if (this.propId) {
			if (this.propId !== 'nuevo') {
				this.obtenerPropiedad(this.propId).then((data: Propiedad) => {
					this.propiedad = data;
				});
			} else {

				this.propiedad = {
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

	obtenerPropiedad(id: string) {
		return new Promise(resolve => {
			if (this.propId === 'nuevo') {
				resolve('No hay data es una propiedad nueva');
			} else {
				this.misPropiedadesService.obtenerPropiedad(id).subscribe((propiedad: Propiedad) => {
					resolve(propiedad);
				});
			}
		});
	}

	guardarFormulario(event, stepper) {
		console.log(event, stepper);
		// Desde el componente hijo (form.component.ts) recibo con un eventemitter que me notifica que
		// el formulario y sus datos son válidos, dejo una copia en el servicio que estalista para ser guardada.
		if (event.invalid) {
			return;
		}
		// this.propiedad.inmobiliaria = f.value.inmobiliaria;

		this.misPropiedadesService
			.guardarPropiedad(event.value, this.propId) // Envío propId para saber si inserta ('nuevo') o actualiza ('id')
			.subscribe(resp => {
				console.log('Guardado:', resp);
				this.propiedad = resp.propiedad;
				this.misPropiedadesService.stepperGoNext(stepper);
				this.router.navigate(['/propiedad', resp.propiedad._id]);
			});

	}


}
