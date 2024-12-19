import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    //private urlAPI='https://localhost:7277/Login';

    //constructor(private httpClient:HttpClient) { }
    // método para iniciar sesion
    /*inicio_Sesion(credenciales: { Nombre: string; Clave: string }): Observable<any> {
        if (credenciales.Nombre === 'admin' && credenciales.Clave === 'admin') {
          return this.httpClient.post(`${this.urlAPI}/login`, credenciales);
        } else {
          return throwError('Credenciales inválidas. Nombre y clave incorrectos.');
        }
      }

    // Método para cerrar sesión
    cerrar_sesion():void{
        localStorage.removeItem('token');
    }
    // método para verificar si el usuario esta autenticado
    esta_autenticado():boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }*/
    private usuarios=[
        { Nombre: 'admin', Clave: 'admin' }
    ];
    constructor() {}

    inicio_Sesion(credenciales: { Nombre: string; Clave: string }): Observable<any> {
        const usuarioValido = this.usuarios.find(
            usuario => usuario.Nombre === credenciales.Nombre && usuario.Clave === credenciales.Clave
        );

        if (usuarioValido) {
            // Simular éxito y retorno de un token (por ejemplo, JWT)
            return of({ token: 'dummy-jwt-token' });
        } else {
            return throwError('Credenciales inválidas.');
        }
    }
    // Método para cerrar sesión
    cerrarSesion(): void {
        localStorage.removeItem('token');
    }

    // Método para verificar si el usuario está autenticado
    estaAutenticado(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }
}
