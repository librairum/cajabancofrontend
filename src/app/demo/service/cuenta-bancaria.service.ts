import { insertCuenta_Bancaria, updCuenta_Bancaria, delCuenta_Bancaria } from './../components/cuenta-bancaria/Cuenta_Bancaria';
import { ApiResponse } from './../model/api_response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Cuenta_Bancaria } from '../components/cuenta-bancaria/Cuenta_Bancaria';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaService {
  private apiUrl = 'https://localhost:7277/CtaBancaria';

  constructor(private http: HttpClient) { }

  // método para listar
  GetCuentasBancarias(idBanco:string): Observable<Cuenta_Bancaria[]> {
    return this.http.get<ApiResponse<Cuenta_Bancaria>>(`${this.apiUrl}/SpList?idempresa=01&idbanco=${idBanco}`)
      .pipe(map(response => response.data));
  }
  // método para crear una nueva cuenta bancaria
  CreateCuentaBancaria(cuentaBancaria: insertCuenta_Bancaria): Observable<string> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/SpCreate`, cuentaBancaria)
      .pipe(
        map(response => response.item || ''),
        catchError(error => {
          console.error('Error al crear el usuario:', error);
          return throwError(() => new Error('No se pudo crear al usuario. Intente nuevamente.'));
        })
      );
  }
  UpdateCuentaBancaria(cuentaBancariaActualizar: updCuenta_Bancaria): Observable<string> {
    return this.http.put<ApiResponse<string>>(`${this.apiUrl}/SpUpdate`, cuentaBancariaActualizar)
      .pipe(map(response => response.item));
  }
  DeleteCuentaBancaria(idBanco:string, idnro: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/SpDelete?codigoempresa=01&idbanco=${idBanco}&idnro=${idnro}`)
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar el usuario:', error);
          return throwError(error);
        })
      );
  }
  //   CreateCuentaBancaria(cuentaBancaria: insertCuenta_Bancaria): Observable<insertCuenta_Bancaria>{
  //     return this.http.post<insertCuenta_Bancaria>(`${this.apiUrl}/SpCreate`);

  // }
  // GetCuentasBancarias():Observable<Cuenta_Bancaria[]>{
  //     return this.http.get<Cuenta_Bancaria[]>(`${this.apiUrl}/SpList?idempresa=01&idbanco=01`);
  // }

  // método para listar por una empresa idbanco e idcuenta
  // GetCuentaBancaria(empresa:string,idbanco:string,idcuenta:string):Observable<Cuenta_Bancaria>{
  //     return this.http.get<Cuenta_Bancaria>(`${this.apiUrl}/${empresa}/${idbanco}/${idcuenta}`);
  // }



  // // método para actualizar una cuenta bancaria
  // UpdateCuentaBancaria(empresa: string, idbanco:string, idcuenta:string, cuentaBancaria:Cuenta_Bancaria):Observable<Cuenta_Bancaria>{
  //     return this.http.put<Cuenta_Bancaria>(`${this.apiUrl}/${empresa}/${idbanco}/${idcuenta}`, cuentaBancaria);
  // }

  // // método para eliminar una cuenta bancaria
  // DeleteCuentaBancaria(empresa:string, idbanco:string, idcuenta:string):Observable<void>{
  //     return this.http.delete<void>(`${this.apiUrl}/${empresa}/${idbanco}/${idcuenta}`);
  // }

}
