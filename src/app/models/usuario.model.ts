export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password: string,
    public img?: string, // luego de un parámetro opcional, todos los demás parámetros también son opcionales.
    public role?: string,
    public google?: boolean,
    public _id?: string
  ) {}
}
