import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Propiedad } from 'src/app/models/propiedad.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-confirm',
  templateUrl: './form-confirm.component.html',
  styleUrls: ['./form-confirm.component.scss']
})
export class FormConfirmComponent implements OnInit {
  @Input() propiedad: Propiedad;
  @Output() activar = new EventEmitter();
  constructor(private router: Router) { }

  ngOnInit() {

  }

  cambiarEstado() {
    this.activar.emit('');
    this.router.navigateByUrl('/propiedades');
  }
}
