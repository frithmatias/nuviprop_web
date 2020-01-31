export class Localidades {
    constructor (
        public ok: boolean,
        public localidades: Localidad[]
    ){}
}

export class Localidad {
    constructor(
        public coords: any[],
        public _id: string,
        public properties: Properties,
        public type: string,
        public geometry: Geometry
    ){}
}

export class Geometry {
    constructor(
        public coordinates: number[],
        public type: string
    ){}
}

export class Properties {
    constructor(
        public categoria: string,
        public fuente: string,
        public municipio: Municipio,
        public departamento: Municipio,
        public nombre: string,
        public id: string,
        public provincia: Municipio,
        public localidad_censal: Municipio
    ){}
}

export class Municipio {
    constructor(
        public nombre: string,
        public id: string
    ){}
}

