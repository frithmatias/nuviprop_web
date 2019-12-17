export class respForm {
  constructor(
    public ok: boolean,
    public form: FormData[],
    public total: number
  ) { }
}

export class FormData {
  constructor(
    public controls: Control[],
    public _id: string,
    public type: string,
    public name: string,
    public id: string,
    public label: string
  ) { }
}

export class Control {
  constructor(
    public type: string,
    public name: string,
    public id: string,
    public label?: string,
    public value?: Value,
    public selects?: Value[]
  ) { }
}

export class Value {
  constructor(
    public type: string,
    public name: string,
    public id: string,
    public value: string,
    public label: string,
    public fill?: Fill
  ) { }
}

export class Fill {
  constructor(
    public fill_control: string,
    public value: Value[]
  ) { }
}

