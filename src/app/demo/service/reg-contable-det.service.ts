import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { InfoVoucherCompleto, ObtenerCuentaCorriente, ObtenerCuentaHaby, ObtenerInformacion, obtenerTipoDocumento, VoucherContableDetalle } from '../components/presupuesto/presupuesto';
import { map, Observable, tap } from 'rxjs';
import { GlobalService } from './global.service';

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
        private configService: ConfigService,
        private globalService: GlobalService
    ) {
        this.apiUrl = (window as any).config?.url;
        const config = `${this.apiUrl}/CtaCtable`;
        this.urlApi = config;
        this.urlBase = `${this.apiUrl}`;
    }

    public obtenerCuenta(): Observable<ObtenerCuentaHaby[]> {
        const params = new HttpParams()
            .set('empresa', this.globalService.getCodigoEmpresa())
            .set('anio', '2024');

        return this.http
            .get<RespuestaAPI<ObtenerCuentaHaby>>(
                `${this.urlApi}/SpTraeAyudaHabyMov`,
                { params }
            )
            .pipe(map((response) => response.data));
    }

    public obtenerCuentaCorriente(): Observable<ObtenerCuentaCorriente[]> {
        const params = new HttpParams().set(
            'empresa',
            this.globalService.getCodigoEmpresa()
        );

        return this.http
            .get<RespuestaAPI<ObtenerCuentaCorriente>>(
                `${this.urlApi}/SpTraeAyudaProveedor`,
                { params }
            )
            .pipe(map((response) => response.data));
    }

    public obtenerTipoDocumentos(): Observable<obtenerTipoDocumento[]> {
        const params = new HttpParams().set(
            'empresa',
            this.globalService.getCodigoEmpresa()
        );

        return this.http
            .get<RespuestaAPI<obtenerTipoDocumento>>(
                `${this.urlApi}/SpTraeAyudaTipoDocumentos`,
                { params }
            )
            .pipe(map((response) => response.data));
    }

    public obtenerInformacionDetallada(
        anio,
        mes,
        libro,
        voucher,
        nroOrden
    ): Observable<InfoVoucherCompleto> {
        const params = new HttpParams()
            .set('empresa', this.globalService.getCodigoEmpresa())
            .set('anio', anio)
            .set('mes', mes)
            .set('libro', libro)
            .set('voucher', voucher)
            .set('nroOrden', nroOrden);

        return this.http
            .get<RespuestaAPIInformacion<InfoVoucherCompleto>>(
                `${this.urlApi}/SpTraeRegContableDet`,
                { params }
            )
            .pipe(map((response) => response.data));
    }

    public actualizarVoucher(
        voucherInfo
    ): Observable<any> {
        let urlModificarVoucher = this.urlApi + '/SpActualiza';
        return this.http.put<any>(urlModificarVoucher, voucherInfo);
    }

    public EliminarPago(
        anio: string,
        mes: string,
        libro: string,
        voucher: string,
        nroOrden: number
    ): Observable<any> {

        let urlEliminar = `${
            this.urlApi
        }/SpElimina?empresa=${this.globalService.getCodigoEmpresa()}&anio=${anio}&mes=${mes}&libro=${libro}&numeroVoucher=${voucher}&nroOden=${nroOrden}`;
        return this.http
            .delete<any>(urlEliminar);
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
