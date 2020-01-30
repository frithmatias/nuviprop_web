interface Localidades {
    ok: boolean;
    localidades: Localidad[];
}

interface Localidad {
    coords: any[];
    _id: string;
    properties: Properties;
    type: string;
    geometry: Geometry;
    current: boolean;
}

interface Geometry {
    coordinates: number[];
    type: string;
}

interface Properties {
    categoria: string;
    fuente: string;
    municipio: Municipio;
    departamento: Municipio;
    nombre: string;
    id: string;
    provincia: Municipio;
    localidad_censal: Municipio;
}

interface Municipio {
    nombre: string;
    id: string;
}
