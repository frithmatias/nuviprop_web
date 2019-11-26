import { Component, OnInit } from '@angular/core';
import { PropiedadesService } from 'src/app/services/services.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Inmobiliaria } from 'src/app/models/inmobiliaria.model';
import { Propiedad } from 'src/app/models/propiedad.model';
import { InmobiliariaService } from 'src/app/pages/inmobiliarias/inmobiliarias.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-propiedad',
  templateUrl: './propiedad.component.html',
  styles: []
})
export class PropiedadComponent implements OnInit {
  propiedad: Propiedad = new Propiedad('', '', '', '', '', '', '', 0);

  inmobiliarias: Inmobiliaria[] = [];
  inmobiliaria: Inmobiliaria = new Inmobiliaria('');
  id: string;

  constructor(
    public propiedadesService: PropiedadesService,
    public inmobiliariaService: InmobiliariaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService
  ) {

    activatedRoute.params.subscribe(params => {

      this.id = params.id;
      this.cargarInmobiliarias();
      if (this.id !== 'nuevo') {
        this.cargarPropiedad(this.id);
      }
    });
  }

  ngOnInit() {
    this.modalUploadService.notificacion.subscribe(resp => {
      // actualizo la lista de inmobiliarias
      /// this.inmobiliaria.img = resp.inmobiliaria.img;
    });
  }

  cargarInmobiliarias() {
    this.inmobiliariaService.cargarInmobiliarias().subscribe(inmobiliarias => {
      this.inmobiliarias = inmobiliarias;
      console.log(inmobiliarias);
    });
  }

  cargarPropiedad(id: string) {
    this.propiedadesService.obtenerPropiedad(id).subscribe((propiedad: any) => {
      this.propiedad = propiedad;
      console.log(propiedad);
      this.propiedad.inmobiliaria = propiedad.inmobiliaria._id;
      this.cambioInmobiliaria(this.propiedad.inmobiliaria);
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
    console.log(this.inmobiliaria);
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('propiedades', this.propiedad._id);
  }
}
