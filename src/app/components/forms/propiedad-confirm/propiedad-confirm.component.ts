import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Propiedad } from 'src/app/models/propiedad.model';
import { Router } from '@angular/router';
import { PropiedadesService } from 'src/app/services/services.index';

@Component({
  selector: 'app-form-propiedad-confirm',
  templateUrl: './propiedad-confirm.component.html',
  styleUrls: ['./propiedad-confirm.component.scss']
})
export class PropiedadConfirmComponent implements OnInit {
  @Input() propiedad: Propiedad;
  @Output() activar = new EventEmitter();
  constructor(
    private router: Router,
    private propiedadesService: PropiedadesService) { }

  ngOnInit() {

  }


  cambiarEstado() {
    this.propiedadesService.cambiarEstado(this.propiedad._id).subscribe(data => {
      console.log(data);
    });
  }


  guardarFormulario(event, stepper) {

    // Desde el componente hijo (form.component.ts) recibo con un eventemitter que me notifica que
    // el formulario y sus datos son válidos, dejo una copia en el servicio que estalista para ser guardada.
    if (event.invalid) {
      return;
    }
    this.propiedadesService
      .guardarDetalles(event.value, this.propiedad) // Envío propId para saber si inserta ('nuevo') o actualiza ('id')
      .subscribe(resp => {
        console.log('Guardado:', resp);
        this.propiedad.detalles = resp.detalles;
        if (this.propiedad.activo) {
          console.log('ACTIVO SE DIRECCIONA A VER PROP');
          // this.router.navigate(['/propiedadver', this.propiedad._id]);
          this.router.navigate(['/propiedades']);

        } else {
          console.log('ACTIVO SE DIRECCIONA A NEXT STEP');

          this.propiedadesService.stepperGoNext(stepper);
        }
      });
  }
}
