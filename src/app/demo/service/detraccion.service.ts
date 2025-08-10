import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
    catchError,
    map,
    Observable,
    throwError,
} from 'rxjs';
import { ConfigService } from './config.service';
import { DetraccionMasiva } from '../model/DetraccionMasiva';
import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';
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
    
    public GetAllDetraccion(empresa:string, anio:string, mes:string): Observable<DetraccionMasiva[]>{
        let urlSolicitud =`${this.urlAPI}/SpListMasivo?empresa=${empresa}&anio=${anio}&mes=${mes}`;
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


}