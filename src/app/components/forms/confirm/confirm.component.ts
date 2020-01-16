import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MisAvisosService } from 'src/app/services/services.index';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  @Input() aviso: Aviso;
  avisoId: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private misAvisosService: MisAvisosService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      this.avisoId = params.id;
    })
  }


  cambiarEstado() {
    if (this.avisoId === 'nuevo') {
      this.snackBar.open('¡Debe guardar el aviso primero!', 'Aceptar', {
        duration: 2000,
      });
    } else {
      this.misAvisosService.cambiarEstado(this.aviso._id).subscribe(data => {
        this.router.navigate(['/avisos']);
      });
    }
  }

}
