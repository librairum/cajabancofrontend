import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, throwError } from 'rxjs';
import { Usuario } from '../components/login/Login';
interface LoginResponse{
    token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private urlAPI = 'https://localhost:7277/Auth/login';
    constructor(private http: HttpClient){ }

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
