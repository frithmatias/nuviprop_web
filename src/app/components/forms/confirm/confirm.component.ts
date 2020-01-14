import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { Router } from '@angular/router';
import { MisAvisosService } from 'src/app/services/services.index';

@Component({
  selector: 'app-form-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @Input() aviso: Aviso;
  @Output() activar = new EventEmitter();
  constructor(
    private router: Router,
    private misAvisosService: MisAvisosService) { }

  ngOnInit() {

  }


  cambiarEstado() {
    this.misAvisosService.cambiarEstado(this.aviso._id).subscribe(data => {
      this.router.navigate(['/avisos']);
      console.log(data);
    });
  }

}
