export interface cabeceraPresupuesto{
    pagoNumero: string;
    fecha: string;
    mediopago:string;
    motivo:string;
    impBrutoSoles:number;
    impBrutoDolares:number;
    impDetraccionSoles:number;
    impRetencionSoles:number;
    impPercepcionSoles:number;
    netoPagaSoles:number;
    netoPagoDolares:number;
    estado:string;
    nombreMedioPago:string;
    ban01FechaEjecucionPago:string;
    ban01NroOperacion:string;
    ban01EnlacePago:string;

}

export interface Detallepresupuesto{
    item: number;
    ban02Empresa: string;
    ban02Codigo: string;
    ban02Ruc: string;
    ban02numero: string;
    ban02Fecha: string;
    ban02Proveedor: string | null;
    ban02TipoCambio: string;
    ban02TipoAplic: string;
    ban02Tipodoc: string;
    ban02NroDoc: string;
    ban02Moneda: string;
    ban02Soles: number;
    ban02Dolares: number;
    ban02SolesVale: string;
    ban02PagoSoles: number;
    ban02PagoDolares: number;
    tipoDetraccion: string;
    ban02TasaDet: number;
    ban02ImporteSolesDet: number;
    ban02ImporteSolesPercepcion: number;
    ban02ImporteSolesRet: number;
    ban02SolesNeto: number;
    ban02DolaresNeto: number;
    nombreTipDoc: string;
    razonsocial: string;
    nombreTipoDocumento: string | null;
    nombremoneda: string | null;
    ban02TipoDetraccion: string | null;
    ban02Tasadetraccion: number;
    ban02ImporteDetraccionSoles: number;
    ban02ImporteDetraccionDolares: number;
    ban02TasaRetencion: number;
    ban02ImporteRetencionSoles: number;
    ban02ImporteRetencionDolares: number;
    ban02TasaPercepcion: number;
    ban02ImportePercepcionSoles: number;
    ban02ImportePercepcionDolares: number;
    ban02NetoSoles: number;
    ban02NetoDolares: number;
    ban02FechaEmision: string;
    ban02FechaVencimiento: string;
}

export interface agregar_Pago{
    clave:string;
    ruc:string;
    razonSocial:string;
    coditoTipoDoc:string;
    nombreTipoDOc:string;
    numeroDOcumento:string;
    monedaOriginal:string;
    soles:number;
    dolares:number;
    fechaEmision:string;
    fechaVencimiento:string;
    diasAtrazo:number;
    afectoDetraccion:string;
    afectoRetencion:string;
}

export interface proveedores_lista{
    ruc:string;
    razonsocial:string;
}
export interface mediopago_lista{
    ban01Empresa : string;
    ban01IdTipoPago:string;
    ban01Descripcion:string;
}
export interface insert_detalle{
    empresa: string;
    numeropresupuesto: string;
    tipoaplicacion: string;
    fechapresupuesto: string;
    bcoliquidacion: string;
    xmlDetalle: string;
}

export interface insert_presupuesto{
    ban01Empresa: string;
    ban01Numero: string;
    ban01Anio: string;
    ban01Mes: string;
    ban01Descripcion: string;
    ban01Fecha: string;
    ban01Estado: string;
    ban01Usuario: string;
    ban01Pc: string;
    ban01FechaRegistro: string;
    ban01mediopago:string;
    NombreMedioPago:string;
}
