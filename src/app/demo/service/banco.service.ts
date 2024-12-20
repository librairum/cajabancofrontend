import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import { Banco } from '../components/banco/Banco';
@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private http = inject(HttpClient);
  private urlAPI = 'https://localhost:7277/Banco';
s
  constructor(private  httpClient: HttpClient ) {   }

  public GetBancos(){
    return this.httpClient.get<Banco[]>(this.urlAPI);
    //return this.httpClient.get(this.urlAPI);
  }

  public CrearBanco(banco: Banco): Observable<any>{
    return this.http.post<any>(this.urlAPI, banco);

  }
  public ActualizarBanco(idempresa: string,  idbanco:string, banco : Banco) : Observable<any>{
    let urlmodificada = `${this.urlAPI}?empresa=${idempresa}&idbanco=${idbanco}`;

    return this.http.put<any>(urlmodificada, banco);
  }
  public EliminarBanco(idempresa: string, idbanco: string): Observable<any> {
    let urlmodificada = `${this.urlAPI}/${idempresa}/${idbanco}`;
    console.log(`Solicitud a eliminar: ${urlmodificada}`);
    return this.http.delete<any>(urlmodificada);
    }


  public getData() : Observable<Banco[]> {
    return this.http.get<Banco[]>(this.urlAPI);


  }

  ComboboxBancos():Observable<Banco[]>{
    return this.httpClient.get<Banco[]>(this.urlAPI);
  }



}
