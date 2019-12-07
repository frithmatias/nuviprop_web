export class FileUpload {
    // File no hay que importarlo, es una propiedad de TypeScript
    public archivo: File;
    public nombreArchivo: string;
    public url: string;
    public estaSubiendo: boolean; // flag
    public progreso: number;

    constructor(archivo: File) {
        this.archivo = archivo;
        this.nombreArchivo = archivo.name;
        this.estaSubiendo = false;
        this.progreso = 0;
    }
}
