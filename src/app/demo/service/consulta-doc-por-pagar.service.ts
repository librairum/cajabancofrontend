import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConsultaDocPorPago } from './../model/ConsultaDocPorPago'; // Asegúrate de que la ruta sea correcta
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { RespuestaAPIBase } from '../components/utilities/funciones_utilitarias';

@Injectable({
  providedIn: 'root'
})
export class ConsultaDocPorPagoService {

  private http = inject(HttpClient);
      urlAPI: string = ''; //
    apiUrl: any;
  
      constructor(
          private httpClient: HttpClient,
          private configService: ConfigService
      ) {
        this.apiUrl = configService.getApiUrl();
        this.urlAPI = `${this.apiUrl}/ConsultaDocPorPago`;
    }
   public GetConsultaDocPorPago(empresa:string): Observable<ConsultaDocPorPago[]> {
         const params=new HttpParams()
         .set('empresa',empresa)
         return this.http.get<RespuestaAPIBase<ConsultaDocPorPago[]>>(`${this.urlAPI}/SpTraeDocPorPagarConsulta?empresa=01&filtro=31`, { params }).pipe(
           map(response => response.data));
   
   
       }

}
