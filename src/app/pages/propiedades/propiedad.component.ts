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

  constructor(
    public propiedadesService: PropiedadesService,
    public inmobiliariaService: InmobiliariaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
      const id = params.id;

      if (id !== 'nuevo') {
        this.cargarPropiedad(id);
      }
    });
  }

  ngOnInit() {
    this.inmobiliariaService.cargarInmobiliarias().subscribe(inmobiliarias => {
      console.log(inmobiliarias);
      this.inmobiliarias = inmobiliarias;
    });

    this.modalUploadService.notificacion.subscribe(resp => {
      console.log(resp);
      // actualizo la lista de inmobiliarias
      this.inmobiliaria.img = resp.inmobiliaria.img;
    });
  }

  cargarPropiedad(id: string) {
    this.propiedadesService.obtenerPropiedad(id).subscribe((propiedad: any) => {
      console.log(propiedad);
      this.propiedad = propiedad;
      // this.propiedad.inmobiliaria = propiedad.inmobiliaria._id;
      this.cambioInmobiliaria(propiedad.inmobiliaria._id);
    });
  }

  guardarPropiedad(f: NgForm) {
    console.log(f.valid);
    console.log(f.value);

    if (f.invalid) {
      return;
    }

    this.propiedadesService
      .guardarPropiedad(this.propiedad)
      .subscribe(propiedad => {
        this.propiedad._id = propiedad._id;

        this.router.navigate(['/propiedad', propiedad._id]);
      });
  }

  cambioInmobiliaria(id: string) {
    console.log(id);
    this.inmobiliariaService
      .obtenerInmobiliaria(id)
      .subscribe(inmobiliaria => (this.inmobiliaria = inmobiliaria));
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('propiedades', this.propiedad._id);
  }
}
