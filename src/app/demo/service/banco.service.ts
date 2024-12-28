import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import { Banco } from '../components/banco/Banco';
@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private http = inject(HttpClient);
  private urlAPI = 'https://localhost:7277/Banco';
s
  constructor(private  httpClient: HttpClient ) {   }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Retorna un Observable de error
  }

  public GetBancos(): Observable<Banco[]> {
    return this.http.get<RespuestaAPI>(this.urlAPI+"/SpList?empresa=01").pipe(
      map((response: RespuestaAPI) => {
        if (response.isSuccess && response.data) {
          console.log(response.data);
          return response.data; // Retorna el array de Bancos
        } else {
          console.error("Error en la API:", response.message, response.messageException);
          return []; // Devuelve un array vacío en caso de error
        }
      }),
      catchError(this.handleError)
    );
  }
  
  public CrearBanco(banco: Banco): Observable<any>{
    return this.http.post<any>(this.urlAPI+"/SpCreate", banco);

  }
  public ActualizarBanco(banco : Banco) : Observable<any>{
    //let urlmodificada = `${this.urlAPI}+"/SpUpdate"`;
    let urlmodificada =this.urlAPI+"/SpUpdate";
    //console.log(urlmodificada);
    //console.log(banco);
    return this.http.put<any>(urlmodificada, banco);
  }
  public EliminarBanco(idempresa: string, idbanco:string): Observable<any> {
    let urlmodificada = `${this.urlAPI}/SpDelete?idempresa=${idempresa}&idbanco=${idbanco}`;
    
    //let urlmodificada = this.urlAPI+"/SpDelete?";
    //console.log(urlmodificada);
    //console.log(banco);
    //console.log(`Solicitud a eliminar: ${urlmodificada}`);
    //return this.http.delete<any>(urlmodificada, banco);
    return this.http.delete<any>(urlmodificada);
    }


  public getData() : Observable<Banco[]> {
    return this.http.get<Banco[]>(this.urlAPI);


  }

  ComboboxBancos():Observable<Banco[]>{
    return this.httpClient.get<Banco[]>(this.urlAPI);
  }



}

interface RespuestaAPI {
  message: string;
  messageException: string | null;
  isSuccess: boolean;
  item: any | null; // Puedes tipar 'item' si conoces su estructura
  data: Banco[];
  total: number;
  mensajeRetorno: string | null;
  flagRetorno: number;
}
