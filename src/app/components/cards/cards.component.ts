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
	  console.log(this.avisos);
		 if (localStorage.getItem('usuario')) {
			this.propFavoritas = this.usuarioService.usuario.favoritos;
			console.log(this.propFavoritas);
		}
  }

  // Los favoritos se guardan en la localstorage en 'usuario.favoritos[]'
  agregarFavorito(aviso: Aviso) {
	this.usuarioService.agregarFavorito(aviso._id).subscribe(
		(data) => {
		console.log(data);
		localStorage.setItem('usuario', JSON.stringify(data));
		this.propFavoritas = data.favoritos;
		},
		err => {
		// console.log(err);
		});
  }




}
