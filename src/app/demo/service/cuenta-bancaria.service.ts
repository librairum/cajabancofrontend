import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta_Bancaria } from '../components/cuenta-bancaria/Cuenta_Bancaria';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaService {
    private apiUrl='https://localhost:7277/CuentaBancaria';

    constructor(private http: HttpClient) { }

    // método para listar
    GetCuentasBancarias():Observable<Cuenta_Bancaria[]>{
        return this.http.get<Cuenta_Bancaria[]>(`${this.apiUrl}`);
    }

    // método para listar por una empresa idbanco e idcuenta
    GetCuentaBancaria(empresa:string,idbanco:string,idcuenta:string):Observable<Cuenta_Bancaria>{
        return this.http.get<Cuenta_Bancaria>(`${this.apiUrl}/${empresa}/${idbanco}/${idcuenta}`);
    }

    // método para crear una nueva cuenta bancaria
    CreateCuentaBancaria(cuentaBancaria: Cuenta_Bancaria): Observable<Cuenta_Bancaria>{
        return this.http.post<Cuenta_Bancaria>(`${this.apiUrl}`, cuentaBancaria);
    }

    // método para actualizar una cuenta bancaria
    UpdateCuentaBancaria(empresa: string, idbanco:string, idcuenta:string, cuentaBancaria:Cuenta_Bancaria):Observable<Cuenta_Bancaria>{
        return this.http.put<Cuenta_Bancaria>(`${this.apiUrl}/${empresa}/${idbanco}/${idcuenta}`, cuentaBancaria);
    }

    // método para eliminar una cuenta bancaria
    DeleteCuentaBancaria(empresa:string, idbanco:string, idcuenta:string):Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${empresa}/${idbanco}/${idcuenta}`);
    }

}
