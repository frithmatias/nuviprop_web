export class Form {
	constructor(
		public ok: boolean,
		public controls: Control[]
	) { }
}

export class Control {
	constructor(
		public _id: string,
		public nombre: string,
		public id: string,
		public type: string,
		public required: boolean,
		public tipooperacion: string[],
		public tipoinmueble: string[],
		public options: Option[]
	) { }
}

export class Option {
	constructor(
		public _id: string,
		public control: string,
		public nombre: string,
		public id: string
	) { }
}
