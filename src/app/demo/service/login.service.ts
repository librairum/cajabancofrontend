
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap, throwError } from 'rxjs';
import { EmpresasxModulo, Login, Usuario } from '../components/login/Login';
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
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());

    constructor(private http: HttpClient){
        window.addEventListener('beforeunload', () => {
            this.logout();
        });

        // Agregar listener para el evento unload
        window.addEventListener('unload', () => {
            this.logout();
        });
    }

    autenticacion(autenticacion:Login): Observable<RespuestaAPI<Login>>{
        const url=`${this.urlAPI}/SpList`;
        return this.http.post<RespuestaAPI<Login>>(url,autenticacion).pipe(
            tap(response=>{
                if(response.isSuccess){
                    localStorage.setItem('userSession',JSON.stringify({
                        isAuthenticated: true,
                        userData: response.data[0]
                    }));
                    this.isAuthenticatedSubject.next(true);
                    localStorage.setItem('sesionStartTime',new Date().toISOString());
                }
            })
        )
    }
//codigoPerfil, string codModulo
    TraerMenuxPerfil(codigoPerfil: string, codModulo: string){
        //?codigoPerfil=03&codModulo=01
        let urlAcceso = `${this.urlAPI}/SpTraeMenuxPerfil?codigoPerfil=${codigoPerfil}&codModulo=${codModulo}`;
        return this.http.get<MenuxPerfil>(urlAcceso);
    }
    logout():void{
        localStorage.removeItem('userSession');
        localStorage.removeItem('sessionStartTime');
        this.isAuthenticatedSubject.next(false);
    }

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    private checkAuthStatus(): boolean {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session).isAuthenticated : false;
    }

    private checkSessionExpiration(): boolean {
        const startTime = localStorage.getItem('sessionStartTime');
        if (!startTime) return false;

        const currentTime = new Date();
        const sessionStart = new Date(startTime);
        const diffHours = (currentTime.getTime() - sessionStart.getTime()) / (1000 * 60 * 60);

        // Por ejemplo, cerrar sesión después de 24 horas
        return diffHours >= 4;
    }
    getEmpresa(codigomodulo:string):Observable<EmpresasxModulo[]>{
        const params=new HttpParams()
        .set('codigomodulo',codigomodulo);
        return this.http.get<RespuestaAPI<EmpresasxModulo>>(`${this.urlAPI}/SpTraeEmpresasxModulo`,{params}).pipe(map(response=>response.data));
    }
}

export interface RespuestaAPI<T> {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: T | null;
    data: T[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}

