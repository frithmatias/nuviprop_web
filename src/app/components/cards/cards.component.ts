import { Component, OnInit, Input } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { UsuarioService, FormsService } from 'src/app/services/services.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Input() avisos: Aviso[] = [];
  propFavoritas = [];
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private formsService: FormsService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('favoritos')) {
      this.propFavoritas = localStorage.getItem('favoritos').split(',');
    } else {
      this.propFavoritas = this.usuarioService.usuario.favoritos;
    }
  }


  agregarFavorito(aviso: Aviso) {
    this.usuarioService.agregarFavorito(aviso._id).subscribe(
      (data) => {
        console.log('favoritos: ', data);
        this.propFavoritas = data.favoritos;
        localStorage.setItem('favoritos', data.favoritos.toString());
      },
      err => {
        // console.log(err);
      });
  }




}
