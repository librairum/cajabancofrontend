import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { catchError, filter, first, firstValueFrom, map, Observable, switchMap, throwError } from 'rxjs';
import { Banco } from '../components/banco/Banco';
import { ConfigService } from './config.service';
@Injectable({
    providedIn: 'root',
})
export class BancoService {
    private http = inject(HttpClient);
    //apiUrl: string = ''; //
    urlAPI: string = ''; //

    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService
    ) {
        this.configService.getConfigObservable().subscribe((config) => {
            if (config) {
                //this.apiUrl = config.apiUrl;
                this.urlAPI = `${config.apiUrl}/Banco`;
                console.log('Configuración lista:', this.urlAPI);
            }
        });
    }

    //private urlAPI = `${this.apiUrl}/Banco`;

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
  
    // Método seguro corregido que verifica si la URL está disponible antes de ejecutar cualquier operación
    private executeWithUrlCheck<T>(operation: () => Observable<T>): Observable<T> {
      if (!this.urlAPI) {
        console.warn('La URL de la API no está configurada todavía. Esperando configuración...');
        // Espera a que la URL esté disponible y luego ejecuta la operación
        return this.configService.getConfigObservable().pipe(
          filter(config => !!config), // Solo continúa cuando hay una configuración válida
          // Usar switchMap en lugar de map para trabajar correctamente con Observables anidados
          switchMap(config => {
            // Actualiza la URL si es necesario
            if (!this.urlAPI && config) {
              //this.apiUrl = config.apiUrl;
              this.urlAPI = `${config.apiUrl}/Banco`;
              console.log('URL configurada en executeWithUrlCheck:', this.urlAPI);
            }
            // Ejecuta la operación original
            return operation();
          }),
          catchError(error => {
            console.error('Error al obtener la configuración:', error);
            return throwError(() => new Error('No se pudo obtener la configuración de la API'));
          })
        );
      }
      
      // Si la URL ya está configurada, ejecuta la operación directamente
      return operation();
    }
  
    // Ejemplo de cómo usar el método de verificación con GetBancos
    public GetBancos(): Observable<Banco[]> {
      return this.executeWithUrlCheck<Banco[]>(() => {
        return this.http
          .get<RespuestaAPI>(this.urlAPI + '/SpList?empresa=01')
          .pipe(
            map((response: RespuestaAPI) => {
              if (response.isSuccess && response.data) {
                console.log(response.data);
                return response.data;
              } else {
                console.error(
                  'Error en la API:',
                  response.message,
                  response.messageException
                );
                return [];
              }
            }),
            catchError(this.handleError)
          );
      });
    }
    public CrearBanco(banco: Banco): Observable<any> {
      return this.executeWithUrlCheck<any>(() => {
        return this.http.post<any>(this.urlAPI + '/SpCreate', banco);
      });
    }
    
    public ActualizarBanco(banco: Banco): Observable<any> {
      return this.executeWithUrlCheck<any>(() => {
        let urlmodificada = this.urlAPI + '/SpUpdate';
        return this.http.put<any>(urlmodificada, banco);
      });
    }
    
    public EliminarBanco(idempresa: string, idbanco: string): Observable<any> {
      return this.executeWithUrlCheck<any>(() => {
        let urlmodificada = `${this.urlAPI}/SpDelete?idempresa=${idempresa}&idbanco=${idbanco}`;
        return this.http.delete<any>(urlmodificada);
      });
    }
    
    public getData(): Observable<Banco[]> {
      return this.executeWithUrlCheck<Banco[]>(() => {
        return this.http.get<Banco[]>(this.urlAPI);
      });
    }
    
    ComboboxBancos(): Observable<Banco[]> {
      return this.executeWithUrlCheck<Banco[]>(() => {
        return this.httpClient.get<Banco[]>(this.urlAPI);
      });
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
