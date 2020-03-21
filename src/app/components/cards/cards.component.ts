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
	propFavoritas = {};
	cantidad = 0;
	params: string;
	parsetemplate = false;
	constructor(
		private router: Router,
		public usuarioService: UsuarioService
	) { }


	ngOnInit() {
		$.getScript('../../../assets/fotorama/fotorama.dev.js');
		if (localStorage.getItem('usuario')) {
			const usuario = JSON.parse(localStorage.getItem('usuario'));
			usuario.favoritos.forEach(favorito => {
				this.propFavoritas[favorito] = true;
			});
		}
	}

	ngOnChanges(changes: any) {
		// console.log(changes);
		if (changes.avisos && changes.avisos.currentValue && changes.avisos.currentValue.length > 0) {
			$.getScript('../../../assets/fotorama/fotorama.dev.js');
			this.cantidad = changes.avisos.currentValue.length;
			this.parsetemplate = true;
		}

	}
	// Los favoritos se guardan en la localstorage en 'usuario.favoritos[]'

	agregarFavorito(aviso: Aviso) {
		// para que la vista actualice el favorito (corazon rojo) cambio el estado del aviso 
		// asumiendo que pudo cambiarlo, pero si falla la actualización en la base de datos 
		// vuelvo a cambiar el estado cuando obtengo el error en la respuesta.
		this.propFavoritas[aviso._id] = !this.propFavoritas[aviso._id];
		this.usuarioService.agregarFavorito(aviso._id).subscribe((data) => {

			if (data.ok) {
				localStorage.setItem('usuario', JSON.stringify(data.usuario));
				this.propFavoritas = {};
				data.usuario.favoritos.forEach(favorito => {
					this.propFavoritas[favorito] = true;
				});
			} else {
				// si fallo vuelvo el corazón al estado anterior
				this.propFavoritas[aviso._id] = !this.propFavoritas[aviso._id];
			}

			// Solo si estoy en Favoritos (no en Avisos) tengo que quitar el aviso de la lista de avisos.
			if (this.router.url === '/favoritos') {
				this.avisos = this.avisos.filter(avisoenlista => {
					return avisoenlista._id !== aviso._id;
				});
			}

		},
			err => {
			});
	}


}
