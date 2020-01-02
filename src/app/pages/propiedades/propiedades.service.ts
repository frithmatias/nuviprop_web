import { Injectable } from '@angular/core';
import { MisPropiedadesService } from '../mispropiedades/mispropiedades.service';
import { Propiedad, Propiedades } from 'src/app/models/propiedad.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuarios.service';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PropiedadesService {
	propiedades: Propiedad[] = [];
	propiedadestotal = 1;
	actualPage = 0;
	tabselected = 0;

	constructor(
		private http: HttpClient,
		private usuarioService: UsuarioService,
		private misPropiedadesService: MisPropiedadesService
	) {
		this.cargarPropiedades(0);
	}


	cargarPropiedades(pagina: number) {
		// Sola trae las proiedades activas.

		if (this.actualPage * 20 < this.propiedadestotal) { // solo traigo mas, si quedan mas para mostrar.

			let url = URL_SERVICIOS;
			url += '/propiedades';
			url += '?pagina=' + pagina;

			const headers = new HttpHeaders({
				'x-token': this.usuarioService.token
			});

			this.http.get(url, { headers }).pipe(map((data: Propiedades) => {
				this.propiedades.push(...data.propiedades);
				this.propiedadestotal = data.total;

			}));
		}

		this.actualPage++;
	}

}
