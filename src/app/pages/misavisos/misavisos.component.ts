import { Component, OnInit } from '@angular/core';
import { MisAvisosService  } from 'src/app/services/services.index';
import { Aviso, Avisos } from 'src/app/models/aviso.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-misavisos',
	templateUrl: './misavisos.component.html',
	styleUrls: ['./misavisos.component.css']
})
export class MisAvisosComponent implements OnInit {
	avisos: Aviso[] = [];
	cargando = false;
	pagina = 0;
	totalAvisos = 0;


	constructor(
		private misAvisosService: MisAvisosService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.cargarMisAvisos(0);
	}

	cargarMisAvisos(page: number) {
		if (
			((this.pagina === 0) && (page < 0)) ||
			(((this.pagina + 1) * 20 >= this.totalAvisos) && (page > 0))
		) {
			return;
		}
		this.pagina += page;
		this.cargando = true;
		this.misAvisosService
			.cargarMisAvisos(this.pagina)
			.subscribe((avisos: Avisos) => {
				this.avisos = avisos.avisos;
				this.totalAvisos = avisos.total;
				this.cargando = false;
			});
	}

	buscarAviso(termino: string) {
		// /^[a-z0-9]+$/i
		// ^         Start of string
		// [a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
		// +         one or more times (change to * to allow empty string)
		// $         end of string
		// /i        case-insensitive

		if (termino.length <= 0) {
			this.cargarMisAvisos(0);
			return;
		}

		const regex = new RegExp(/^[a-z0-9]+$/i);
		if (regex.test(termino)) {
			this.cargando = true;
			this.misAvisosService.buscarAviso(termino).subscribe((resp: any) => {
				console.log(resp);
				this.avisos = resp.avisos;
				this.cargando = false;
			});
		} else {
			this.snackBar.open('¡Ingrese sólo caracteres alfanuméricos!', 'Aceptar', {
				duration: 2000,
			});
		}
	}

}
