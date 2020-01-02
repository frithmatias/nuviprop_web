import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Propiedad } from 'src/app/models/propiedad.model';
import { Router } from '@angular/router';
import { MisPropiedadesService } from 'src/app/services/services.index';

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
	private misPropiedadesService: MisPropiedadesService) { }

  ngOnInit() {

  }


  cambiarEstado() {
	this.misPropiedadesService.cambiarEstado(this.propiedad._id).subscribe(data => {
		this.router.navigate(['/propiedades']);
		console.log(data);
	});
  }

}
