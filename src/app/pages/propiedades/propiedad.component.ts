import { Component, OnInit } from '@angular/core';
import { PropiedadesService, UploaderService, FormService } from 'src/app/services/services.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Inmobiliaria } from 'src/app/models/inmobiliaria.model';
import { Propiedad } from 'src/app/models/propiedad.model';
import { InmobiliariaService } from 'src/app/pages/inmobiliarias/inmobiliarias.service';
import { NgForm, FormGroup } from '@angular/forms';
import { FileUpload } from 'src/app/models/fileupload.model';

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

  propiedad: Propiedad = new Propiedad();
  files: FileUpload[] = [];
  inmobiliarias: Inmobiliaria[] = [];
  inmobiliaria: Inmobiliaria = new Inmobiliaria('');
  propId: string; // esta propiedad la necesito para saber si tengo que mostrar el boton "Ver Publicación" en el template
  parsetemplate = false; // con *ngIf cargo el templete sólo cuando ya tengo la data
  formValid = false;
  formData: FormGroup;

  isLinear = true; // material stepper


  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public propiedadesService: PropiedadesService,
    public inmobiliariaService: InmobiliariaService,
    public modalUploadService: ModalUploadService,
    public uploaderService: UploaderService,
    public formService: FormService
  ) {

  }

  ngOnInit() {
    this.modalUploadService.notificacion.subscribe(resp => {
      // actualizo la lista de inmobiliarias
      /// this.inmobiliaria.img = resp.inmobiliaria.img;
    });


    this.activatedRoute.params.subscribe(params => {
      this.propId = params.id;
      if (params.id !== 'nuevo') {
        Promise.all([
          this.obtenerPropiedad(params.id),
          this.obtenerInmobiliarias()
        ]).then(() => {
          this.parsetemplate = true;
        });
      } else {
        this.obtenerInmobiliarias().then((inmobs) => {
          // this.propiedad.inmobiliaria = inmobs[0];
          // si se trata de de un aviso nuevo limpio el array de imagenes y hablilito el template
        });
        this.propiedad.imgs = [];
        this.parsetemplate = true;

      }
    });
  }

  obtenerInmobiliarias() {
    return new Promise((resolve, reject) => {
      this.inmobiliariaService.obtenerInmobiliarias().subscribe(inmobiliarias => {
        this.inmobiliarias = inmobiliarias;
        resolve(this.inmobiliarias);
      });
    });
  }

  obtenerPropiedad(id: string) {
    return new Promise((resolve, reject) => {
      this.propiedadesService.obtenerPropiedad(id).subscribe((propiedad: Propiedad) => {
        this.propiedad = propiedad;
        // this.files = propiedad.imgs;
        console.log('Propiedad obtenida: ', propiedad);
        // this.cambioInmobiliaria(this.propiedad.inmobiliaria._id);
        resolve();
      });

    });
  }


  guardarPropiedad() {
    // console.log(f.valid);
    // console.log(this.formService.formAviso.value);
    if (this.formService.formAviso.invalid) {
      return;
    }
    // this.propiedad.inmobiliaria = f.value.inmobiliaria;
    this.propiedadesService
      .guardarPropiedad(this.formService.formAviso.value, this.propId) // Envío propId para saber si inserta o actualiza
      .subscribe(propiedad => {
        this.propiedad = propiedad;
        console.log(this.propiedad);
        // this.cambioInmobiliaria(propiedad.inmobiliaria);
        // this.router.navigate(['/propiedadver', propiedad._id]);
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

  subir() {
    this.files.forEach(file => {
      this.uploaderService.subirImagen(file, 'propiedades', this.propiedad._id);
    });
  }

  quitarImagenes() {
    this.files = [];
  }

}
