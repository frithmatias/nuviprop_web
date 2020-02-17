export class Usuario {
	constructor(
		public email: string,
		public nombre: string,
		public apellido: string,
		public nacimiento: string,
		public password: string,
		public img?: string, // luego de un parámetro opcional, todos los demás parámetros también son opcionales.
		public role?: string,
		public google?: boolean,
		public favoritos?: string[],
		public _id?: string
	) { }
}
