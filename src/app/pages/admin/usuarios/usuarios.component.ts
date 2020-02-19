import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-usuarios',
	templateUrl: './usuarios.component.html',
	styles: []
})
export class UsuariosComponent implements OnInit {
	// vars & flags
	usuarios: Usuario[] = [];
	desde = 0;
	totalRegistros = 0;
	cargando = false;

	constructor(
		public router: Router,
		public usuarioService: UsuarioService
	) { }

	ngOnInit() {
		this.cargarUsuarios();
	}

	cargarUsuarios() {
		this.cargando = true;
		this.usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
			this.totalRegistros = resp.total;
			this.usuarios = resp.usuarios;
			this.cargando = false;
		});
	}

	cambiarDesde(valor: number) {
		const desde = this.desde + valor;

		if (desde >= this.totalRegistros) {
			return;
		}

		if (desde < 0) {
			return;
		}

		this.desde += valor;
		this.cargarUsuarios();
	}

	buscarUsuario(termino: string) {
		if (termino.length <= 0) {
			this.cargarUsuarios();
			return;
		}

		this.usuarioService
			.buscarUsuarios(termino)
			.subscribe((usuarios: Usuario[]) => {
				this.usuarios = usuarios;
				this.cargando = false;
			});
	}

	borrarUsuario(usuario: Usuario) {
		if (usuario._id === this.usuarioService.usuario._id) {
			Swal.fire(
				'No puede borrar usuario',
				'No se puede borrar a si mismo',
				'error'
			);
			return;
		}

		Swal.fire({
			title: '¿Esta seguro?',
			text: 'Esta a punto de borrar a ' + usuario.nombre,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Si, borrar usuario.'
		}).then(result => {
			if (result.value) {
				this.usuarioService.borrarUsuario(usuario._id).subscribe(
					resp => {
						this.cargarUsuarios();
					},
					err => {
						Swal.fire('Error', err.error.errors.message, 'error');
					},
					() => {
					}
				);
			} else {
			}
		});
	}

	guardarUsuario(usuario: Usuario) {
		Swal.fire({
			title: 'Confirme',
			text: 'Esta a punto de actualizar a ' + usuario.nombre,
			icon: 'warning'
		}).then(borrar => {
			if (borrar) {
				this.usuarioService.actualizarUsuario(usuario).subscribe(
					resp => {
						this.cargarUsuarios();
					},
					err => {
						Swal.fire('Error', err.error.errors.message, 'error');
					},
					() => {
					}
				);
			}
		});
	}
	editarUsuario(usuario: Usuario) {
		this.router.navigate(['/usuarios', usuario._id]);

	}
}
