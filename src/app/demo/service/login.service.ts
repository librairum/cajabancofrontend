
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { Usuario } from '../components/login/Login';
import { Autenticacion } from '../components/login/Autenticacion';
import { PermisosxPerfil } from '../api/permisosxperfil';
import { MenuxPerfil } from '../components/login/MenuxPerfil';
interface LoginResponse{
    token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private urlAPI = 'https://localhost:7277/Autenticacion';
    //https://localhost:7277/Autenticacion/SpTraeMenuxPerfil
    constructor(private http: HttpClient){ }

    InicioSesion(nombreusuario:string,
                  claveusuario:string,
                codigoempresa:string):Observable<Autenticacion>{
   let urlAcceso = `${this.urlAPI}/SpList?nombreusuario=${nombreusuario}&claveusuario=${claveusuario}&codigoempresa=${codigoempresa}`;
        return this.http.get<Autenticacion>(urlAcceso);
    }
//codigoPerfil, string codModulo
    TraerMenuxPerfil(codigoPerfil: string, codModulo: string){
        //?codigoPerfil=03&codModulo=01
        let urlAcceso = `${this.urlAPI}/SpTraeMenuxPerfil?codigoPerfil=${codigoPerfil}&codModulo=${codModulo}`;
        return this.http.get<MenuxPerfil>(urlAcceso);
    }
    login(credentials:Pick<Usuario, 'Sistema'|'Nombre'| 'Clave'>):Observable<LoginResponse>{
        return this.http.post<LoginResponse>(this.urlAPI,credentials)
        .pipe(
            tap(response=>{
                if(response.token){
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn():boolean {
        return !!this.getToken();
    }

    logout():void {
        localStorage.removeItem('token');
    }
}
