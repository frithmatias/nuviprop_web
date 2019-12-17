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

  id: string; // id de la propiedad (si no se trata de una propiedad 'nueva')
  parsetemplate = false; // con *ngIf cargo el templete sólo cuando ya tengo la data

  formValid = false;
  formData: FormGroup;


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
      this.id = params.id;
      console.log('id ', this.id);
      if (this.id !== 'nuevo') {
        Promise.all([
          this.cargarPropiedad(this.id),
          // this.cargarInmobiliarias()
        ]).then(() => {
          this.parsetemplate = true;
        });
      } else {
        this.cargarInmobiliarias().then((inmobs) => {
          console.log(inmobs);
          // this.propiedad.inmobiliaria = inmobs[0];
          this.propiedad.imgs = [];
          this.parsetemplate = true;
        });
      }
    });
  }

  cargarInmobiliarias() {
    return new Promise((resolve, reject) => {
      this.inmobiliariaService.cargarInmobiliarias().subscribe(inmobiliarias => {
        this.inmobiliarias = inmobiliarias;
        console.log('Inmobiliarias obtenidas: ', this.inmobiliarias);
        resolve(this.inmobiliarias);
      });
    });
  }

  cargarPropiedad(id: string) {
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
    console.log(this.formService.formulario.value);
    if (this.formService.formulario.invalid) {
      return;
    }
    // this.propiedad.inmobiliaria = f.value.inmobiliaria;
    this.propiedadesService
      .guardarPropiedad(this.formService.formulario.value)
      .subscribe(propiedad => {
        this.propiedad = propiedad;
        this.cambioInmobiliaria(propiedad.inmobiliaria);
        this.router.navigate(['/propiedadver', propiedad._id]);
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
      this.uploaderService.subirImagen(file, 'propiedades', this.id);
    });
  }

  quitarImagenes() {
    this.files = [];
  }

}
