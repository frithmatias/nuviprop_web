import { Component, OnInit } from '@angular/core';
import { PropiedadesService, UploadFileService } from 'src/app/services/services.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Inmobiliaria } from 'src/app/models/inmobiliaria.model';
import { Propiedad } from 'src/app/models/propiedad.model';
import { InmobiliariaService } from 'src/app/pages/inmobiliarias/inmobiliarias.service';
import { NgForm } from '@angular/forms';
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
  propiedad: Propiedad = new Propiedad('', '', '', '', '', '', '', 0);
  files: FileUpload[] = [];
  inmobiliarias: Inmobiliaria[] = [];
  inmobiliaria: Inmobiliaria = new Inmobiliaria('');
  id: string;
  parsetemplate = false;

  constructor(
    public propiedadesService: PropiedadesService,
    public inmobiliariaService: InmobiliariaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService,
    private uploadFileServie: UploadFileService
  ) {

  }

  ngOnInit() {
    this.modalUploadService.notificacion.subscribe(resp => {
      // actualizo la lista de inmobiliarias
      /// this.inmobiliaria.img = resp.inmobiliaria.img;
    });


    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      if (this.id !== 'nuevo') {
        Promise.all([
          this.cargarPropiedad(this.id),
          this.cargarInmobiliarias()
        ]).then(() => {
          this.parsetemplate = true;
        });
      }
    });
  }

  cargarInmobiliarias() {
    return new Promise((resolve, reject) => {
      this.inmobiliariaService.cargarInmobiliarias().subscribe(inmobiliarias => {
        this.inmobiliarias = inmobiliarias;
        resolve();
      });
    });
  }

  cargarPropiedad(id: string) {
    return new Promise((resolve, reject) => {
      this.propiedadesService.obtenerPropiedad(id).subscribe((propiedad: Propiedad) => {
        this.propiedad = propiedad;
        // this.files = propiedad.imgs;
        console.log('Propiedad obtenida: ', propiedad);
        this.cambioInmobiliaria(this.propiedad.inmobiliaria._id);
        resolve();
      });

    });
  }

  guardarPropiedad(f: NgForm) {
    // console.log(f.valid);
    // console.log(f.value);
    if (f.invalid) {
      return;
    }
    this.propiedad.inmobiliaria = f.value.inmobiliaria;
    this.propiedadesService
      .guardarPropiedad(this.propiedad)
      .subscribe(propiedad => {
        this.propiedad = propiedad;
        this.cambioInmobiliaria(propiedad.inmobiliaria);
        this.router.navigate(['/propiedad', propiedad._id]);
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
      this.uploadFileServie.subirImagen(file, 'propiedades', this.id);
    });
  }

  quitarImagenes() {
    this.files = [];
  }

}
