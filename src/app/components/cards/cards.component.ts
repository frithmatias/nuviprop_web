import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { UsuarioService } from 'src/app/services/services.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnChanges {
  @Input() avisos: Aviso[] = [];
  propFavoritas = [];
  params: string;
  constructor(
	private router: Router,
	public usuarioService: UsuarioService
  ) { }

  ngOnInit() {
	if (localStorage.getItem('usuario')) {
			const usuario = JSON.parse(localStorage.getItem('usuario'));
			this.propFavoritas = usuario.favoritos;
		}
  }

  ngOnChanges(changes: any){}
  // Los favoritos se guardan en la localstorage en 'usuario.favoritos[]'
  agregarFavorito(aviso: Aviso) {
	this.usuarioService.agregarFavorito(aviso._id).subscribe((data) => {
		localStorage.setItem('usuario', JSON.stringify(data));
		this.propFavoritas = data.favoritos;	
		// Solo si estoy en Favoritos (no en Avisos) tengo que quitar el aviso de la lista de avisos.
		if (this.router.url === '/favoritos') {
			this.avisos = this.avisos.filter(avisoenlista => {
				return avisoenlista._id !== aviso._id;
			});
		}
		},
		err => {
		// console.log(err);
		});
  }


	checkFavorito(id: string){
		if(this.propFavoritas.includes(id)){
			return true;
		} else {
			return false;
		}
	}

}
