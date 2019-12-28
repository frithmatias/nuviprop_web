import { Injectable } from '@angular/core';
import { PropiedadesService } from '../propiedades/propiedades.service';
import { Propiedad } from 'src/app/models/propiedad.model';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  private propiedades: Propiedad[] = [];
  private propiedadestotal = 1;
  actualPage = 0;
  tabselected = 0;

  constructor(private propiedadesService: PropiedadesService) {
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    // console.log(this.actualPage);
    if (this.actualPage * 20 < this.propiedadestotal) { // solo traigo mas, si quedan mas para mostrar.
      this.propiedadesService.cargarPropiedades('activas', this.actualPage).subscribe(data => {
        this.propiedades.push(...data.propiedades);
        this.propiedadestotal = data.total;
      });
      this.actualPage++;
    }
  }
}
