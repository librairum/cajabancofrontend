import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ListarPerfil, Usuario, UsuarioCrear } from '../model/Usuario';
import { ConfigService } from './config.service';
import { ApiResponse } from '../model/api_response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = ''
  private urlAPI = ''
  private apiUrl2 = ''
  private apiUrlPerfil = ''

  constructor(private http: HttpClient, private configService: ConfigService) 
  {
    this.apiUrl = configService.getApiUrl();
    this.urlAPI = `${this.apiUrl}/Usuario`;
    this.apiUrl2 = configService.getApiUrl();
    this.apiUrlPerfil = `${this.apiUrl2}/Perfil`;
  }

  getAllPerfil(): Observable<ListarPerfil[]> {
    return this.http.get<ApiResponse<ListarPerfil>>(`${this.apiUrlPerfil}/SpLista`)
      .pipe(map(response => response.data));
  }

  //listar usuarios
  getAll(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario>>(`${this.urlAPI}/SpLista`)
      .pipe(map(response => response.data));
  }
  // crear un nuevo usuario
  create(usuarioCrear: UsuarioCrear): Observable<string> {
    return this.http.post<ApiResponse<string>>(`${this.urlAPI}/SpInserta`, usuarioCrear)
      .pipe(
        map(response => response.item || ''),
        catchError(error => {
          console.error('Error al crear el usuario:', error);
          return throwError(() => new Error('No se pudo crear al usuario. Intente nuevamente.'));
        })
      );
  }

  //editar un usuario
  update(usuarioActualizar: UsuarioCrear): Observable<string> {
    return this.http.put<ApiResponse<string>>(`${this.urlAPI}/SpActualiza`, usuarioActualizar)
      .pipe(map(response => response.item));
  }
  // eliminar
  delete(usuario: Usuario): Observable<void> {
    return this.http.delete<void>(`${this.urlAPI}/SpElimina?codigo=${usuario.codigo}&cuentacod=0000001&empresacod=00001`)
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar el usuario:', error);
          return throwError(error);
        })
      );
  }
}
