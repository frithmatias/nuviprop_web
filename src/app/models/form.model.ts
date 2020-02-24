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


// ADMIN/CONTROLES: Modelo de datos de un control y sus opciones en edicion de controles

export class ControlDataResp {
	constructor(
		public ok: boolean,
		public control: ControlData,
		public options: Option[]
	) { }
}

export class ControlData {
	constructor(
		public _id: string,
		public nombre: string,
		public id: string,
		public type: string,
		public required: boolean
	) { }
}
