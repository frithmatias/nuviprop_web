import { Component, OnInit, Input } from '@angular/core';
import { Propiedad } from 'src/app/models/propiedad.model';
import { Detalles } from 'src/app/models/detalle.model';
import { PropiedadesService } from 'src/app/services/services.index';

@Component({
  selector: 'app-form-confirm',
  templateUrl: './form-confirm.component.html',
  styleUrls: ['./form-confirm.component.scss']
})
export class FormConfirmComponent implements OnInit {
@Input() propiedad: Propiedad;

  constructor(private propiedadesService: PropiedadesService) { }

  ngOnInit() {

  }



}
