import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/services.index';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
	selector: 'app-usuario',
	templateUrl: './usuario.component.html',
	styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit, OnDestroy {
	params: Subscription;
	usuario: Usuario;
	constructor(private activatedRoute: ActivatedRoute, private userService: UsuarioService) { }
	// TODO: Paginar usuarios actualmente muestra solo 5 sin paginador
	ngOnInit() {
		this.params = this.activatedRoute.params.subscribe(params => {
			console.log(params);
			this.userService.obtenerUsuario(params.id).subscribe((user: Usuario) => {
				this.usuario = user;
				console.log(this.usuario);
			});
		});
	}

	ngOnDestroy() {
		this.params.unsubscribe();
	}
}
