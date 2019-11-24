import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from '../pages/usuarios/usuarios.service';

@Injectable()
export class UploadFileService {
  constructor(
    public http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  // subirArchivo(archivo: File, tipo: string, id: string) {
  //   return new Promise((resolve, reject) => {
  //     // ************************************
  //     // USANDO VANILLA JAVASCRIPT Y AJAX
  //     // ************************************
  //     const formData = new FormData();
  //     const xhr = new XMLHttpRequest();
  //     formData.append('imagen', archivo, archivo.name);
  //     xhr.onreadystatechange = function() {
  //       if (xhr.readyState === 4) {
  //         if (xhr.status === 200) {
  //           console.log('Imagen subida');
  //           resolve(JSON.parse(xhr.response));
  //         } else {
  //           console.log('Fallo la subida');
  //           reject(xhr.response);
  //         }
  //       }
  //     };
  //     // http://localhost:3000/upload/usuarios/5dc87bd8d5756a191422c938
  //     const url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
  //     xhr.open('PUT', url, true);
  //     xhr.send(formData);
  //   });
  // }

  // ************************************
  // USANDO HTTPCLIENT
  // ************************************
  subirArchivo(fileItem: File, tipo: string = 'usuarios', id: string) {
    return new Promise((resolve, reject) => {
      const url = URL_SERVICIOS + '/uploads/' + tipo + '/' + id;
      const formData: FormData = new FormData();
      formData.append('imagen', fileItem, fileItem.name);

      const headers = new HttpHeaders({
        'x-token': this.usuarioService.token
      });

      this.http.put(url, formData, { headers, reportProgress: true }).subscribe(
        (resp: any) => {
          console.log(resp);

          // Al igual que en el metodo actualizarUsuario() del servicio UsuarioService
          // Este if es porque SOLO guardo los datos en la localstorage si estoy
          // actualizando datos PROPIOS. Si soy ADMIN y estoy cambiando datos en
          // la lista de usuarios NO tengo que guardar nada en la localstorage.
          if (id === this.usuarioService.usuario._id) {
            this.usuarioService.usuario.img = resp.usuario.img;
            this.usuarioService.guardarStorage(
              resp.usuario._id,
              this.usuarioService.token,
              this.usuarioService.usuario,
              this.usuarioService.menu
            );
          }
          resolve(resp);
        },
        err => {
          reject(err.message);
        }
      );
    });
  }
}
