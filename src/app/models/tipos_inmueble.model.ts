export class TiposInmuebles {
    constructor(
        public ok: boolean,
        public inmuebles: TipoInmueble[],
        public total: number,
    ) { }
}

export class TipoInmueble {
    constructor(
        public _id: string,
        public nombre: string,
        public id: string
    ) { }
}
