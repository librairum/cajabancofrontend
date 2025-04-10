import { Injectable , inject} from '@angular/core';
import { agregar_Pago, cabeceraPresupuesto, ComprobanteUpdateParams, Detallepresupuesto, insert_detalle, insert_presupuesto, proveedores_lista, VoucherContableCabecera, VoucherContableDetalle } from '../components/presupuesto/presupuesto';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { delay, map, Observable, of } from 'rxjs';
import { formatDate } from '@angular/common';
import { ConfigService } from './config.service';
@Injectable({
    providedIn: 'root'
})
export class PresupuestoService {
    private http = inject(HttpClient);

    private urlApi:string = '';
    private urlBase:string = '';
    apiUrl: any;
    constructor(private httpClient: HttpClient,
         private configService:ConfigService)
         {

      this.apiUrl = (window as any).config?.url
            const config = `${this.apiUrl}/Presupuesto`;
           this.urlApi = config;
           this.urlBase=`${this.apiUrl}`;

         }

    public obtenerPresupuesto(empresa: string, anio: string, mes: string): Observable<cabeceraPresupuesto[]> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('anio', anio)
            .set('mes', mes);

        return this.http.get<RespuestaAPI>(`${this.urlApi}/SpList`, { params }).pipe(
            map(response => response.data)
        );

    }
    public obtenerDetallePresupuesto(empresa: string, numerodocumento: string): Observable<Detallepresupuesto[]> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('numerodocumento', numerodocumento);
        return this.http.get<RespuestaAPI2>(`${this.urlApi}/SpListaDet`, { params })
            .pipe(map(response => response.data));
    }
    public obtenerProveedores(empresa: string): Observable<proveedores_lista[]> {
        const params = new HttpParams()
            .set('empresa', empresa)
        return this.http.get<RespuestaAPI3>(`${this.urlApi}/SpTraeProveedores`, { params }).pipe(map(response => response.data));
    }
    public obtenerDocPendiente(empresa: string, ruc: string,
        numerodocumento: string): Observable<agregar_Pago[]> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('ruc', ruc)
            .set('numerodocumento', numerodocumento);
        return this.http.get<RespuestaAPI4>(`${this.urlApi}/SpListaDocPendientes`,
            { params }).pipe(map(response => response.data));
    }
    public insertarDetallePresupuesto(detalle: insert_detalle): Observable<any> {
        console.log("parametros insertar detalle presupuesto");
        console.log(detalle.empresa);
        console.log(detalle.numeropresupuesto);
        console.log(detalle.tipoaplicacion);
        console.log(detalle.fechapresupuesto);
        console.log(detalle.bcoliquidacion);
        console.log(detalle.xmlDetalle);
        console.log("-------------------------");
        const params = new HttpParams()
            .set('Empresa', detalle.empresa)
            .set('numeropresupuesto', detalle.numeropresupuesto)
            .set('tipoaplicacion', detalle.tipoaplicacion)
            .set('fechapresupuesto', detalle.fechapresupuesto)
            .set('bcoliquidacion', detalle.bcoliquidacion)
            .set('xmlDetalle', detalle.xmlDetalle);
        return this.http.post<RespuestaAPI5>(
            `${this.urlApi}/SpInsertaDet`,
            null,
            { params }
        );
    }
    public insertarPresupuesto(presupuesto: insert_presupuesto): Observable<any> {
        console.log(presupuesto)
        return this.http.post(`${this.urlApi}/SpInsert`, presupuesto);
    }
    public actualizarPresupuesto(presupuesto: insert_presupuesto): Observable<any> {
        return this.http.put(`${this.urlApi}/SpActualiza`, presupuesto);
    }
    public eliminarPresupuesto(empresa: string, numero: string): Observable<any> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('numero', numero);

        return this.http.delete(`${this.urlApi}/SpElimina`, { params });
    }

    public eliminarPresupuestoDetalle(empresa: string, numero: string, numeroDetalle: string): Observable<any> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('codigoDetallePresupuesto', numeroDetalle)
            .set('numeroPresupuesto', numero);
        return this.http.delete(`${this.urlApi}/SpEliminaDet`, { params });
    }

    public actualizarDetallePresupuesto(detalle: any): Observable<any> {
        return this.http.put(`${this.urlApi}/SpActualizaDet`, detalle);

    }

    public obtenerMedioPago(empresa: string): Observable<MedioPago[]> {
        const params = new HttpParams()
            .set('empresa', empresa);
        /*https://localhost:7277/Presupuesto/SpTraeTipoPago?empresa=01*/
        return this.http.get<RespuestaAPIMedioPago>(`${this.urlApi}/SpTraeTipoPago`,
            { params }).pipe(map(response => response.data));
    }
    // subida de archivos
    //metodo para subir al servidor
    public subirservidor(file: File): Observable<any> {

        const formData: FormData = new FormData();
        formData.append('file', file);
        const req = new HttpRequest('POST', `${this.urlApi}`, formData, {
            reportProgress: true,
            responseType: 'json'
        });
        return this.http.request(req);

    }

    //metodo para guardar en la carpeta de assest, solo simulación porque esto no funcionaria sin servidor
    simularSubidaArchivo(file: File): Observable<string> {
        console.log(`Simulando guardado de archivo en: cajabancofrontend/src/assets/${file.name}`);
        const objectUrl = URL.createObjectURL(file);
        return of(`assets/${file.name}`).pipe(
            delay(800) // Tiempo de carga
        );

    }

    public actualizarComprobante(params: ComprobanteUpdateParams): Observable<RespuestaAPI5> {
        const httpParams = new HttpParams()
            .set('empresa', params.empresa)
            .set('anio', params.anio)
            .set('mes', params.mes)
            .set('numeropresupuesto', params.numeropresupuesto)
            .set('flagOperacion', params.flagOperacion)
            .set('fechapago', params.fechapago)
            .set('numerooperacion', params.numerooperacion)
            .set('enlacepago', params.enlacepago)
        return this.http.put<RespuestaAPI5>(`${this.urlApi}/SpActualizaComprobante`, null, { params: httpParams });
    }

    public subirArchivo(file: File, destinationPath: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('destinationPath', destinationPath);

        return this.http.post(`${this.urlApi}/SubirArchivo`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    public EliminarArchivo(rutaArchivo:string): Observable<any>{
        const params = new HttpParams()
        .set('rutaArchivo', rutaArchivo);
        return  this.http.delete(`${this.urlApi}/EliminarArchivo`, {
            params
        });
    }

     ////obetener voucher contable////////////////
     public obtenerVoucherContableDetalle(empresa: string, numero: string): Observable<VoucherContableDetalle[]> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('numero', numero);
        return this.http.get<RespuestaAPI6>(`${this.urlBase}/CtaCtable/SpTraeDetalle?`, { params })
            .pipe(map(response => response.data));
    }

    public obtenerVoucherContableCabecera(empresa: string, numero: string): Observable<VoucherContableCabecera[]> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('numero', numero);
        return this.http.get<RespuestaAPI7>(`${this.urlBase}/CtaCtable/SpTraeCabecera?`, { params })
            .pipe(map(response => response.data));
    }


    public eliminarVoucherContableDetalle(
        empresa: string,
        orden: number
    ): Observable<any> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('orden', orden.toString()); // Ajuste para que coincida con la interfaz

        return this.http.delete(`${this.urlApi}/SpEliminaDet`, { params });
    }


}

interface RespuestaAPI5 {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null;
    data: any; // Puedes tipar esto según la respuesta específica que esperes
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}

interface RespuestaAPI {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null; // Puedes tipar 'item' si conoces su estructura
    data: cabeceraPresupuesto[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}

interface RespuestaAPI2 {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null; // Puedes tipar 'item' si conoces su estructura
    data: Detallepresupuesto[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}

interface RespuestaAPI3 {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null; // Puedes tipar 'item' si conoces su estructura
    data: proveedores_lista[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}

interface RespuestaAPI4 {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null; // Puedes tipar 'item' si conoces su estructura
    data: agregar_Pago[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}

interface RespuestaAPIMedioPago {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null; // Puedes tipar 'item' si conoces su estructura
    data: MedioPago[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}
interface MedioPago {
    ban01Empresa: string;
    ban01IdTipoPago: string;
    ban01Descripcion: string;
}

interface RespuestaAPI6{
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null; // Puedes tipar 'item' si conoces su estructura
    data: VoucherContableDetalle[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;

}


interface RespuestaAPI7{
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: any | null; // Puedes tipar 'item' si conoces su estructura
    data: VoucherContableCabecera[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;

}
