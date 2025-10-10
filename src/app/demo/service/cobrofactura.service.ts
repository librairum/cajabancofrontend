import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';
import {
    catchError,
    map,
    Observable,
    throwError,
} from 'rxjs';
import { ConfigService } from './config.service';
import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';
import { RegistroCobro, RegistroCobroDetalle, FacturaPorCobrar } from "../model/CuentaxCobrar";
import { HttpParams } from "@angular/common/http";
import { MedioPago } from "../model/presupuesto";
import { RetencionDetallePresupuestoComponent } from "../components/retencion/retencion-detalle-presupuesto/retencion-detalle-presupuesto.component";
import { TraeRegistroCobro } from "../model/CuentaxCobrar";
import { proveedores_lista } from "../model/presupuesto";
import { ClienteconFactura } from "../model/CuentaxCobrar";
@Injectable({
    providedIn:'root'
})
export class CobroFacturaService{
        private http = inject(HttpClient);
    //apiUrl: string = ''; //
    urlAPI: string = ''; //
    apiUrl: any;
constructor(
        private httpClient: HttpClient,
        private configService: ConfigService
    ) {
        this.apiUrl = configService.getApiUrl();
        this.urlAPI = `${this.apiUrl}/CobroFactura`;
        // console.log(this.urlAPI);
    }
    public getListaRegistroCobro(empresa:string, anio:string, mes:string):Observable<TraeRegistroCobro[]>{
        let urlObtener = `${this.urlAPI}/Lista?empresa=${empresa}&anio=${anio}&mes=${mes}`;
        return this.http
            .get<RespuestaAPIBase<TraeRegistroCobro[]>>(urlObtener)
            .pipe(
                map((response: RespuestaAPIBase<TraeRegistroCobro[]>) =>
                {
                    if(response.isSuccess && response.data){
                        return response.data;
                    }else{
                        console.error('Error en la API:' , 
                            response.message,
                        response.messageException);
                        return [];
                    }
                }), catchError(this.handleError)
            )
    }
    public insertRegistroCobro(registro:RegistroCobro):Observable<any>{
        return this.http.post<any>(this.urlAPI + '/Inserta' , registro);
    }

    public updateRegistroCobro(registro:RegistroCobro){
        return this.http.put<any>(this.urlAPI + '/Actualiza', registro);
    }

    public deleteRegistroCobro(empresa:string, 
        anio:string, mes:string, numero:string ){ 
        // Se revierte a la interpolación de cadenas para garantizar la máxima compatibilidad de enrutamiento con el Backend C#.
        let urlElimina = `${this.urlAPI}/Elimina?empresa=${empresa}&anio=${anio}&mes=${mes}&numero=${numero}`;
        return this.http.delete<any>(urlElimina);
    }
    public getListaMedioPago(empresa: string): Observable<MedioPago[]> {
            const params = new HttpParams().set('empresa', empresa);
            /*https://localhost:7277/Presupuesto/SpTraeTipoPago?empresa=01*/
            return this.http
                .get<RespuestaAPIBase<MedioPago[]>>(
                    `/Presupuesto/SpTraeTipoPago`,
                    {
                        params,
                    }
                )
                .pipe(map((response) => response.data));
    }
/*
this.cobroService.obtenerMedioPago
*/ 
    public getListaAyudaFacturaPorCobrar( empresa:string,usuario:string, 
          clientecodigo:string):Observable<FacturaPorCobrar[]>{
            const params = new HttpParams()
            .set('empresa', empresa)
            // .set('anio', anio)
            // .set('mes', mes)
            .set('usuario','sara')
            .set('clientecodigo',clientecodigo);
        return this.http
            .get<RespuestaAPIBase<FacturaPorCobrar[]>>(
                `${this.urlAPI}/TraeFacturaPorCobrar`,
                {
                    params
                }
            )
            .pipe(map((response) => response.data));
          } 

     public getListaProveedores(
            empresa: string
        ): Observable<proveedores_lista[]> {
            const params = new HttpParams().set('empresa', empresa);
            return this.http
                .get<RespuestaAPIBase<proveedores_lista[]>>(
                    `/Presupuesto/SpTraeProveedores`,
                    { params }
                )
                .pipe(map((response) => response.data));
        }

    public getListaCliente(empresa:string
        ):Observable<ClienteconFactura[]>{
            const params = new HttpParams().set('empresa', empresa);
            return this.http.get<RespuestaAPIBase<ClienteconFactura[]>>(
            `${this.urlAPI}/TraeClienteconFactura`,{params}
            ).pipe(map((response)=>response.data));

        }

    //public getListaCliente()
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));

    }



}