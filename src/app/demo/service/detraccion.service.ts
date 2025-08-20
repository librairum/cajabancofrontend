import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    catchError,
    map,
    Observable,
    throwError,
} from 'rxjs';
import { ConfigService } from './config.service';
import { DetraccionMasiva } from '../model/DetraccionMasiva';
import { formatDateForFilename, RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';
import { DetraccionMasivaDetalle } from '../model/DetraccionMasivaDetalle';
import { DetraccioMasivaDetalleRequest } from '../model/DetraccionMasiva';
@Injectable({
    providedIn: 'root',
})
export class DetraccionService{

    private http=inject(HttpClient);
  urlAPI: string = ''; //
    apiUrl: any;

    constructor(private httpClient: HttpClient, private configService:ConfigService)
    {
        this.apiUrl = configService.getApiUrl();
        this.urlAPI = `${this.apiUrl}/Detraccion`;
    }
    
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
    
    public GetAllDetraccion(empresa:string, anio:string, mes:string, motivoPago:string): Observable<DetraccionMasiva[]>{
        let urlSolicitud =`${this.urlAPI}/SpListMasivo?empresa=${empresa}&anio=${anio}&mes=${mes}&motivoPago=${motivoPago}`;
        return this.http
            .get<RespuestaAPIBase<DetraccionMasiva[]>>(urlSolicitud)
            .pipe(
                map((response:RespuestaAPIBase<DetraccionMasiva[]>)=>
                {
                    if(response.isSuccess && response.data){
                        return response.data;
                    }else{
                        console.error('Error en la API:',
                            response.message,
                            response.messageException
                        );
                        return[];
                    }
                }),
                catchError(this.handleError)
            );
    }
    public GetallDetraccionDet(empresa:string, numeroLote:string):Observable<DetraccionMasivaDetalle[]>
    {
        let urlSolicitud =`${this.urlAPI}/SpListMasivoDet?empresa=${empresa}&numeroLote=${numeroLote}`;
         return this.http
            .get<RespuestaAPIBase<DetraccionMasivaDetalle[]>>(urlSolicitud)
            .pipe(
                map((response:RespuestaAPIBase<DetraccionMasivaDetalle[]>)=>
                {
                    if(response.isSuccess && response.data){
                        return response.data;
                    }else{
                        console.error('Error en la API:',
                            response.message,
                            response.messageException
                        );
                        return[];
                    }
                }),
                catchError(this.handleError)
            );
    }

    public InsertarDetraccionMasiva(detramasiva:DetraccioMasivaDetalleRequest, file : File): Observable<any>{
        const formData = new FormData();
        formData.append('archivoOriginal',file);
        formData.append('request', JSON.stringify(detramasiva));
        return this.http.post<RespuestaAPIBase<any>>(`${this.urlAPI}/SpInsertaPresupuestoDetraMasiva`,formData );
    }
    
}