export interface cabeceraPresupuesto{
    PagoNro: string;
    Fecha: string;
    motivo:string;
    mediopago:string;
    brutopagarsoles:number;
    brutopagardolares:number;
    afectodetraccion:number;
    afectoretencion:number;
    afectopercepcion:number;
    netopagosoles:number;
    netopagodolares:number;
    estado:string;
    enlaceadjunto:string;
}

export interface Detallepresupuesto{
    item:number;
    ruc:string;
    razonsocial:string;
    TipoDoc:string;
    Numero :string;
    MonedaOriginal:string;
    importetotalsoles:number;
    importetotaldolares:number;
    Montopagarsoles:number;
    montopagardolares:number;
    detracciontipo:string;
    detracciontasa:string;
    detraccionimporte:number;
    retencion:number;
    percepcion:number;
    netopagasoles:number;
    netopagadolares:number;
}
