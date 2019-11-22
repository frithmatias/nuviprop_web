import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagenPipe'
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: string = 'usuarios', id: string): any {
    let url = URL_SERVICIOS + '/imagenes';

    if (!img) {
      return url + '/usuarios/xxx';
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }
    switch (tipo) {
      case 'usuarios':
        url += '/usuarios/' + id + '/' + img;
        break;

      case 'propiedades':
        url += '/propiedades/' + id + '/' + img;
        break;

      case 'inmobiliarias':
        url += '/inmobiliarias/' + id + '/' + img;
        break;

      default:
        console.log('tipo de imagen no existe, usuarios, propiedades');
        url += '/usuarios/xxx';
    }
    return url;
  }
}
