import { Injectable } from '@angular/core';
import { agregar_Pago, cabeceraPresupuesto, Detallepresupuesto, insert_detalle, insert_presupuesto, proveedores_lista } from '../components/presupuesto/presupuesto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PresupuestoService {
    private urlApi = 'https://localhost:7277/Presupuesto'

    constructor(private http: HttpClient) { }

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
        return this.http.get<RespuestaAPI2>(`${this.urlApi}/SpListaDet`, {params})
            .pipe(map(response => response.data));
    }
    public obtenerProveedores(empresa:string): Observable<proveedores_lista[]>{
        const params=new HttpParams()
            .set('empresa', empresa)
        return this.http.get<RespuestaAPI3>(`${this.urlApi}/SpTraeProveedores`, {params}).pipe(map(response=>response.data));
    }
    public obtenerDocPendiente(empresa:string,fechavencimiento:string,ruc:string): Observable<agregar_Pago[]>{
        const params=new HttpParams()
            .set('empresa', empresa)
            .set('fechavencimiento', fechavencimiento)
            .set('ruc', ruc);
        return this.http.get<RespuestaAPI4>(`${this.urlApi}/SpListaDocPendientes`, {params}).pipe(map(response=>response.data));
    }
    public insertarDetallePresupuesto(detalle: insert_detalle): Observable<any> {
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
        return this.http.post(`${this.urlApi}/SpInsert`, presupuesto);
    }
    public actualizarPresupuesto(presupuesto:insert_presupuesto):Observable<any>{
        return this.http.put(`${this.urlApi}/SpActualiza`, presupuesto);
    }
    public eliminarPresupuesto(empresa: string, numero: string): Observable<any> {
        const params = new HttpParams()
            .set('empresa', empresa)
            .set('numero', numero);

        return this.http.delete(`${this.urlApi}/SpElimina`, { params });
    }
    public actualizarDetallePresupuesto(detalle:any):Observable<any>{
        return this.http.put(`${this.urlApi}/SpActualizaDet`, detalle);
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
