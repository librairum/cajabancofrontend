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
    enlaceComprobante:string;
}

export interface Detallepresupuesto{
    item:number;
    ban02Ruc:string;
    ban02Proveedor:string;
    ban02Tipodoc:string;
    ban02NroDoc :string;
    ban02Moneda:string;
    ban02Soles:number;
    ban02Dolares:number;
    ban02PagoSoles:number;
    ban02PagoDolares:number;
    tipoDetraccion:string;
    ban02TasaDet:string;
    ban02ImporteSolesDet:number;
    //retencion:number;
    ban02ImporteSolesPercepcion:number;
    netoSoles:number;
    netoDolares:number;
}

export interface agregar_Pago{
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
}

export interface proveedores_lista{
    ruc:string;
    razonsocial:string;
}

export interface insert_detalle{
    empresa:string;
    numeropresupuesto:string;
    tipoaplicacion:string;
    fechapresupuesto:string;
    bcoliquidacion:string;
    xmlDetalle:string;
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
}
