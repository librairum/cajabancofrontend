import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

    private readonly Nombre_Usuario='nombreusuario'
    private readonly Codigo_Empresa='codigoempresa'
    private readonly urlAPIServidor='urlapiservidor'
    private _selectedDate = new BehaviorSubject<Date>(new Date());
    selectedDate$ = this._selectedDate.asObservable();

    constructor() { }

    setNombreUsuario(nombre:string){
        sessionStorage.setItem(this.Nombre_Usuario,nombre);
    }
    getNombreUsuario():string{
        return sessionStorage.getItem(this.Nombre_Usuario);
    }
    setCodigoEmpresa(codigo:string){
        sessionStorage.setItem(this.Codigo_Empresa,codigo);
    }
    getCodigoEmpresa():string{
        return sessionStorage.getItem(this.Codigo_Empresa);
    }
    setUrlApi(urlApi:string){
        sessionStorage.setItem(this.urlAPIServidor, urlApi );
    }

    getUrlApi():string{
        return sessionStorage.getItem(this.urlAPIServidor);
    }
    updateSelectedDate(date: Date) {
        this._selectedDate.next(date);
    }



    clearSession(){
        sessionStorage.removeItem(this.Nombre_Usuario);
        sessionStorage.removeItem(this.Codigo_Empresa);
    }




}
