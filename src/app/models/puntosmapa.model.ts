export class PuntosMapa {
    constructor(

        public type: string,
        public properties: Properties,
        public geometry: Geometry,
    ) { }
}

export class Geometry {
    constructor(
        public type: string,
        public coordinates: number[]
    ) { }
}

export class Properties {
    constructor(

        public description: string,
        public icon: number
    ) { }
}


