import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagenPipe'
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: string, id: string): any {
    let url = URL_SERVICIOS + '/imagenes';

    if (!img) {
      return url + '/usuarios/xxx';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }
    switch (tipo) {
      case 'usuarios':
      case 'propiedades':
      case 'inmobiliarias':

        url += '/' + tipo + '/' + id + '/' + img;
        // console.log('Tipo coleccion ok: ', url);
        break;

      default:
        url += '/usuarios/xxx';
      // console.log('Tipo coleccion falló: ', url);
    }
    return url;
  }
}
