import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ObtenerCuentaCorriente, ObtenerCuentaHaby, ObtenerInformacion, obtenerTipoDocumento } from '../components/presupuesto/presupuesto';
import { map, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegContableDetService {
    private http = inject(HttpClient);
    private urlApi: string = '';
    private urlBase: string = '';
    apiUrl: any;

    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService
    ) {
        this.apiUrl = (window as any).config?.url;
        const config = `${this.apiUrl}/CtaCtable`;
        this.urlApi = config;
        this.urlBase = `${this.apiUrl}`;
    }

    public obtenerCuenta(): Observable<ObtenerCuentaHaby[]> {
        const params = new HttpParams()
            .set('empresa', '01')
            .set('anio', '2024');

        return this.http
            .get<RespuestaAPI<ObtenerCuentaHaby>>(
                `${this.urlApi}/SpTraeAyudaHabyMov`,
                { params }
            )
            .pipe(map((response) => response.data));
    }

    public obtenerCuentaCorriente(): Observable<ObtenerCuentaCorriente[]> {
        const params = new HttpParams().set('empresa', '01');

        return this.http
            .get<RespuestaAPI<ObtenerCuentaCorriente>>(
                `${this.urlApi}/SpTraeAyudaProveedor`,
                { params }
            )
            .pipe(map((response) => response.data));
    }

    public obtenerTipoDocumentos(): Observable<obtenerTipoDocumento[]> {
        const params = new HttpParams().set('empresa', '01');

        return this.http
            .get<RespuestaAPI<obtenerTipoDocumento>>(
                `${this.urlApi}/SpTraeAyudaTipoDocumentos`,
                { params }
            )
            .pipe(map((response) => response.data));
    }

    public obtenerInformacionDetallada(anio, mes, libro, voucher, nroOrden): Observable<ObtenerInformacion> {
    const params = new HttpParams()
        .set('empresa', '01')
        .set('anio', anio)
        .set('mes', mes)
        .set('libro', libro)
        .set('voucher', voucher)
        .set('nroOrden', nroOrden);

    return this.http
        .get<RespuestaAPIInformacion<ObtenerInformacion>>(
            `${this.urlApi}/SpTraeRegContableDet`,
            { params }
        )
        .pipe(map((response) => response.data));
    }
}

interface RespuestaAPI<T> {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: T | null;
    data: T[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}

interface RespuestaAPIInformacion<T> {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: T | null;
    data: T;
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}
