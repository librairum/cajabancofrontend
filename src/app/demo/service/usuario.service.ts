import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/Login';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    private apiUrl: string = ''

  constructor(private http:HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.getApiUrl();
  }

  // para listar
  listar_usuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // registrar un usuario
  crear_usuario(usuario:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
  // Actuzaliar usuario
  actualizar_usuario(Nombre:string, usuario:Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.apiUrl}/${Nombre}`, usuario);
  }
  // Eliminar "Nombre como ID"
  eliminar_usuario(Nombre:string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${Nombre}`);
  }
}
