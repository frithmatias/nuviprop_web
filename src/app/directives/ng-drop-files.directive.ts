import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileUpload } from '../models/fileupload.model';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {
  /*
  creamos el nombre del evento en este caso mouseSobre, del tipo EventEmitter, quiere emitir un booleano
  podríamos poner any si no sabemos que queremos transmitir.
  */
  @Input() tipo: string;
  @Input() id: string;
  @Input() archivos: FileUpload[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  /*
  vamos a especificar un callback cuando suceda el "dragover", va a disparar un evento
  la función recibe el evento y disparamos una notificacion para que el padre sepa que esta
  encima. Pero para hablar con el padre o el elemento que lo contiene, hacemos el @Output
  */

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    console.log('entro!');
    this._prevenirDetener(event);
    this.mouseSobre.emit(true);

  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    console.log('salio!');
    this.mouseSobre.emit(false);
  }

  // cuando se solto el mouse
  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    console.log('Solto!');
    this.mouseSobre.emit(false);

    // Guardo en la constante trasferencia la información de los archivos
    const transferencia = this._getTransferencia(event);
    if (!transferencia) {
      return;
    }
    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);
  }


  // esta función va a recibir el evento del tipo any
  private _getTransferencia(event: any) {
    /*Esto es para extender la compatibilidad porque hay algunos navegadores que lo manejan directo con
    event.dataTransfer y otros event.originalEvent.dataTrasnfer;*/
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;

  }

  /*Esta función es para trabajar con los archivos, vamos a extraerlos de la constante "transferencia"*/
  private _extraerArchivos(archivosLista: FileList) {
    console.log(archivosLista);
    /*Ya puedo recibir UN OBJETO con la información de los archivos soltados, pero ES UN OBJETO y no me sirve tengo
    que extraer la información y devolverla como array. A la función getOwnPropertyNames le mando como argumento el
    objeto que quiero separar. El ciclo for barre cada una de las propiedades del objeto archivosLista.

    archivosLista:

      FileList {0: File, 1: File, length: 2}
        0: File {name: "turtle-icon.png", lastModified: 1573327649336, lastModifiedDate: Sat Nov 09 2019 16:27:29 GMT-0300 (hora estándar de Argentina), webkitRelativePath: "", size: 15735, …}
        1: File {name: "sheep-icon.png", lastModified: 1573327663115, lastModifiedDate: Sat Nov 09 2019 16:27:43 GMT-0300 (hora estándar de Argentina), webkitRelativePath: "", size: 11778, …}
        length: 2
        __proto__: FileList

    */
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      // verifico si el archivo puede ser cargado... podemos crear un nuevo elemento del tipo fileItem
      // dentro del arreglo archivos[]
      if (this._fileCanLoaded(archivoTemporal)) {
        const nuevoArchivo = new FileUpload(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }
    /*En this.archivos ya tengo un arreglo con todos las imagenes para subir, si yo inento cargar por segunda vez un mismo
    archivo no me va a dejar. Ahora lo quiero relacionar con los archivos que tengo en el componente.

    En carga.component.html en el elemento donde tenemos la directiva appNgDropFiles ponemos
    archivos en la directiva -> [archivos]="archivos" <- archivos en el componente
    Javascript pasa por referencia TODOS los objetos, por lo tanto si se modifica en el compoente, se modifica en la directiva.
    Representan al mismo objeto.
    */
    console.log(this.archivos);
  }


  // validaciones
  // cuando hacemos el DROP queremos que el chrome NO tenga el comportamiento por defecto de abrir la imagen

  private _fileCanLoaded(archivo: File): boolean {
    // si el archivo NO fue ya dropeado... y es una imagen...
    if (!this._fileWasDropped(archivo.name) && this._isImage(archivo.type)) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDetener(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  // la segunda validación sera que el archivo que estoy dropeando no haya sido ya dropeado.
  private _fileWasDropped(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('El archivo ' + nombreArchivo + ' ya fué agregado.');
        return true;
      }
    }
    return false;
  }

  // verificar que el archivo sea una imagen leyendo el doctype
  // tipoArchivo.startsWith('image'); devuelve 1 si lo encuentra y -1 si no lo encuentra, 1 es true y -1 es interpretado como false.

  private _isImage(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }




}
