import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: any = { apiUrl: 'http://192.168.1.44:7277' }; // Valor por defecto servidor
    // private config:any ={ apiUrl:'http://localhost:7277'}; // valor por defecto desarrollo
    constructor(private http: HttpClient) {

        console.log("cargar loadConfig");
        //this.config = firstValueFrom(this.http.get('/assets/config.json'));
        
    }

 

    getConfig() : Observable<any>{
        return of ((window as any).config);

    }
    getApiUrl(): string{
        return (window as any).config?.apiUrl || 'http://192.168.1.44:7277'; //produccion
        //return (window as any).config?.apiUrl || 'http://localhost:7277'; //desarrollo
    }
}