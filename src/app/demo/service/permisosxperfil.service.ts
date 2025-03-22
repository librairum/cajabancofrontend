import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosxPerfil } from '../api/permisosxperfil';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class PermisosxPerfilService {
    private http = inject(HttpClient);

    private urlAPI: string = '';
    apiUrl: any;
    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService
    ) {
        this.apiUrl = (window as any).config?.url;
        this.urlAPI = `${this.apiUrl}/PermisosxPerfil`;
    }
    public GetPermisosxperfil(
        codperfil: string,
        codmod: string
    ): Observable<PermisosxPerfil[]> {
        const url = `${this.urlAPI}/${codperfil}/${codmod}`;
        return this.http.get<PermisosxPerfil[]>(url);
        //return this.httpClient.get<PermisosxPerfil[]>(url);
    }
}
