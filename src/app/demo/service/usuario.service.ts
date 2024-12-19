import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../components/login/Login';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    private apiUrl='https://localhost:7277/Banco'

  constructor(private http:HttpClient) { }

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
