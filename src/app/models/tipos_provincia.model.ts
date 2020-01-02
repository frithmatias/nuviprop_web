
export class RespProvincias {
    constructor(
        public ok: boolean,
        public provincias: Provincia[],
        public total: number,
    ) { }
}

export class Provincia {
    constructor(
        public properties: Properties,
        public _id: string,
        public type: string
    ) { }
}

export class Properties {
    constructor(
        public nombre_completo: string,
        public fuente: string,
        public iso_id: string,
        public nombre: string,
        public id: string,
        public categoria: string,
        public iso_nombre: string
    ) { }
}

