import { Injectable } from '@angular/core';
import { PropiedadesService } from '../propiedades/propiedades.service';
import { Propiedad } from 'src/app/models/propiedad.model';

@Injectable({
  providedIn: 'root'
})
export class InicioService {
  private propiedades: Propiedad[] = [];
  private propiedadestotal = 1;
  actualPage = 0;
  tabselected = 0;

  constructor(private propiedadesService: PropiedadesService) {
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    console.log('cargando propiedades pagina:', this.actualPage);
    // es importante usar el operador spread para que haga un PUSH de los elementos del array
    // sino va a emter todo un array completo como un nuevo elemento dentro del array.
    if (this.actualPage * 10 < this.propiedadestotal) { // solo traigo mas, si quedan mas para mostrar.
      this.propiedadesService.cargarPropiedades(this.actualPage).subscribe(data => {
        this.propiedades.push(...data.propiedades);
        console.log(this.propiedades);
        this.propiedadestotal = data.total;
      });
      this.actualPage++;
    }
  }
}
