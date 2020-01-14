
export class TiposUnidades {
    constructor(
        public ok: boolean,
        public unidades: TipoUnidad[],
        public total: number,
    ) { }
}

export class TipoUnidad {
    constructor(
        public _id: string,
        public nombre: string,
        public id: string,
        public idparent: string
    ) { }
}

