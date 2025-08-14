export interface DetraccionMasiva{
  empresaCod :string;
  anio:string;
  mes:string;
 loteDetraccionNro:string;
 presupuestoCod:string;
 facturaImporteSol:string;
 detraccionImporteSol:string;

      }
export interface DetraccioMasivaDetalleRequest{
        ban01Empresa:string;
        ban01Anio: string;
        ban01mes: string;
        ban01Descripcion: string;
        ban01Fecha: string;
        ban01Estado: string;
        ban01Usuario: string;
        ban01Pc: string;
        ban01FechaRegistro: string;
        ban01MedioPago: string;
        detraccionLote: string;
        ban01motivopagoCod: string;
        numerooperacion: string;
        enlacePago: string;
        nombreArchivo: string;
        
        flagOperacion: string;
}
    
