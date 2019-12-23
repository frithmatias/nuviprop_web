import { Component, OnInit } from '@angular/core';
import { PropiedadesService, UploaderService, FormService } from 'src/app/services/services.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from 'src/app/models/propiedad.model';
import { InmobiliariaService } from 'src/app/pages/inmobiliarias/inmobiliarias.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { respForm, FormularioData } from 'src/app/models/form.model';
import { Detalles } from 'src/app/models/detalle.model';
import { Inmobiliaria } from 'src/app/models/inmobiliaria.model';

@Component({
  selector: 'app-propiedad',
  templateUrl: './propiedad.component.html',
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
export class PropiedadComponent implements OnInit {

  parsetemplate = false;
  propId: string; // esta propiedad la necesito para saber si tengo que mostrar el boton "Ver Publicación" en el template
  formValid = false;
  isLinear = true; // material stepper
  formsGroups: FormGroup[] = [];
  propiedad: Propiedad = new Propiedad();
  inmobiliaria: Inmobiliaria;
  inmobiliarias: Inmobiliaria[] = [];
  forms: FormularioData[] = [];
  defaultData: Propiedad;
  defaultDetallesData: Detalles;





  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public propiedadesService: PropiedadesService,
    public inmobiliariaService: InmobiliariaService,
    public modalUploadService: ModalUploadService,
    public uploaderService: UploaderService,
    public formService: FormService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.propId = params.id;
    });

    this.propiedadesService.scrollTop();


    this.obtenerPropiedad(this.propId).then(() => {
      this.obtenerFormularios(['propiedad', 'detalle']).then(() => {
        this.buildForms().then(() => {
          this.parsetemplate = true;
        });
      });
    });
  }


  async obtenerFormularios(formularios: string[]) {
    return new Promise(resolve => {
      formularios.forEach(formulario => {
        this.propiedadesService.obtenerFormularios(formulario).subscribe((data: respForm) => {
          this.forms.push(data.form[0]);
          if (formularios.length <= this.forms.length) {
            resolve();
          }

        });
      });
      console.log('Formularios cargados: ', this.forms);
    });
  }

  obtenerPropiedad(id: string) {
    return new Promise(resolve => {
      if (this.propId === 'nuevo') {
        console.log(this.propiedad);
        resolve();
      } else {
        this.propiedadesService.obtenerPropiedad(id).subscribe((propiedad: Propiedad) => {
          this.propiedad = propiedad;
          // this.files = propiedad.imgs;
          console.log('Propiedad obtenida: ', this.propiedad);
          resolve();
          // this.cambioInmobiliaria(this.propiedad.inmobiliaria._id);
        });
      }
    });
  }

  buildForms() {
    return new Promise(resolve => {

      if (this.propId === 'nuevo') {
        this.defaultData = {
          calle: 'Mercedes',
          altura: 2325,
          piso: 0,
          depto: '',
          tipoinmueble: 'Terreno',
          tipounidad: 'tipounidad',
          tipooperacion: 'Venta',
          titulo: 'Este es el titulo del aviso',
          descripcion: 'La descripcion tiene que ser larga debe superar los 50 caracteres para validar el control de lo contrario no se puede submitir.',
          precio: 490000,
          moneda: 'monedadolares',
          nopublicarprecio: true,
          aptocredito: false,
          pais: 'Argentina',
          provincia: 'Ciudad de Buenos Aires',
          partido: 'Ciudad de Buenos Aires',
          localidad: 'Comuna 10',
          barrio: 'Floresta',
          subbarrio: 'Monte Castro',
          codigopostal: '1417',
        };

        this.defaultDetallesData = {
          terraza: 'sitieneterraza'
        };
      } else {
        console.log(this.propiedad);
        this.defaultData = this.propiedad;

      }


      console.log('Construyendo forms');
      this.formsGroups[0] = this.formBuilder.group({
        calle: [this.defaultData.calle, [Validators.required, Validators.minLength(5)]],
        altura: [this.defaultData.altura, [Validators.required, Validators.pattern('[0-9]{1,5}')]],
        piso: [this.defaultData.piso, [Validators.pattern('[0-9]{1,5}')]],
        depto: [this.defaultData.depto, [Validators.pattern('[a-z][A-Z][0-9]{1,5}')]],
        tipoinmueble: [this.defaultData.tipoinmueble, [Validators.required]],
        tipounidad: [this.defaultData.tipounidad],
        tipooperacion: [this.defaultData.tipooperacion, [Validators.required]],
        titulo: [this.defaultData.titulo, [Validators.required, Validators.minLength(10)]],
        descripcion: [this.defaultData.descripcion, [Validators.required, Validators.minLength(100)]],
        precio: [this.defaultData.precio, [Validators.required, Validators.pattern('[0-9]{1,10}')]],
        moneda: [this.defaultData.moneda, Validators.required],
        nopublicarprecio: [this.defaultData.nopublicarprecio, Validators.required],
        aptocredito: [this.defaultData.aptocredito, Validators.required],
        pais: [this.defaultData.pais, [Validators.required, Validators.minLength(3)]],
        provincia: [this.defaultData.provincia, [Validators.required, Validators.minLength(5)]],
        partido: [this.defaultData.partido, [Validators.required, Validators.minLength(5)]],
        localidad: [this.defaultData.localidad, [Validators.required, Validators.minLength(5)]],
        barrio: [this.defaultData.barrio, [Validators.required, Validators.minLength(5)]],
        subbarrio: [this.defaultData.subbarrio, [Validators.required, Validators.minLength(5)]],
        codigopostal: [this.defaultData.codigopostal, [Validators.required, Validators.pattern('[A-Za-z0-9]{4,10}')]]
      });

      this.formsGroups[1] = this.formBuilder.group({
        terraza: ['', [Validators.required, Validators.minLength(5)]],
      });

      resolve();
    });


  }

  guardarFormulario(formname, event, stepper) {

    // Desde el componente hijo (form.component.ts) recibo con un eventemitter que me notifica que
    // el formulario y sus datos son válidos, dejo una copia en el servicio que estalista para ser guardada.
    if (event.invalid) {
      return;
    }
    // this.propiedad.inmobiliaria = f.value.inmobiliaria;

    if (formname === 'propiedad') {
      this.propiedadesService
        .guardarPropiedad(event.value, this.propId) // Envío propId para saber si inserta ('nuevo') o actualiza ('id')
        .subscribe(resp => {
          console.log('Guardado:', resp);
          this.propiedad = resp.propiedad;
          this.propiedadesService.stepperGoNext(stepper);
          this.router.navigate(['/propiedad', resp.propiedad._id]);
        });
    } else if (formname === 'detalle') {
      this.propiedadesService
        .guardarDetalles(event.value, this.propiedad) // Envío propId para saber si inserta ('nuevo') o actualiza ('id')
        .subscribe(resp => {
          console.log('Guardado:', resp);
          this.propiedad = resp.propiedad;
          this.propiedadesService.stepperGoNext(stepper);
          this.router.navigate(['/propiedad', resp.propiedad._id]);
        });
    }
  }



  obtenerInmobiliarias() {
    return new Promise((resolve, reject) => {
      this.inmobiliariaService.obtenerInmobiliarias().subscribe(inmobiliarias => {
        this.inmobiliarias = inmobiliarias;
        resolve(this.inmobiliarias);
      });
    });
  }

  cambioInmobiliaria(id: string) {
    this.inmobiliarias.forEach(inmobiliaria => {
      if (inmobiliaria._id === id) {
        this.inmobiliaria = inmobiliaria;
      }
    });
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('propiedades', this.propiedad._id);
  }


}
