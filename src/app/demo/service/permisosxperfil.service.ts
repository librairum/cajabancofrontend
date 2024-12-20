import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosxPerfil } from '../api/permisosxperfil';

@Injectable({
  providedIn: 'root'
})
export class PermisosxPerfilService {
  private http = inject(HttpClient);
  private urlAPI = 'https://localhost:7277/PermisosxPerfil';

  constructor(private httpClient: HttpClient) {}
  public GetPermisosxperfil(codperfil: string, codmod: string): Observable<PermisosxPerfil[]> {
    const url = `${this.urlAPI}/${codperfil}/${codmod}`;
    return this.httpClient.get<PermisosxPerfil[]>(url);
  }
}
