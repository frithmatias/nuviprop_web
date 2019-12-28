
export class TiposOperaciones {
    constructor(
        public ok: boolean,
        public operaciones: TipoOperacion[],
        public total: number,
    ) { }
}

export class TipoOperacion {
    constructor(
        public _id: string,
        public nombre: string,
        public id: string
    ) { }
}
