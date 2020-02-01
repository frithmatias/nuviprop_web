import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagenPipe'
})


@Injectable({
	providedIn: 'root' // Only available with angular 6+, else add it to providers
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: string, id: string): any {
    let url = URL_SERVICIOS + '/imagenes';

    if (!img) {
      // al no existir esta url el backend me devuelve una imagen por defecto 'NO IMAGE'
      return url + '/xxx/xxx/xxx'; // http://localhost:3000/imagenes/xxx/xxx/xxx -> 'usuarios'/user_id/img_id
    }

    if (img.indexOf('https') >= 0) {
      return img;
    }
    switch (tipo) {
      case 'usuarios':
      case 'avisos':
      case 'inmobiliarias':

        url += '/' + tipo + '/' + id + '/' + img;
        // console.log('Tipo coleccion ok: ', url);
        break;

      default:
        url += '/xxx/xxx/xxx';
      // console.log('Tipo coleccion falló: ', url);
    }
    return url;
  }
}
