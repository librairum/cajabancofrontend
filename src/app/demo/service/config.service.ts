import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: any = { apiUrl: 'http://localhost:7278' }; // Valor por defecto developer
    // private config:any ={ apiUrl:'http://localhost:4240'}; // valor por defecto produccion
    constructor(private http: HttpClient) {

        console.log("cargar loadConfig");
        //this.config = firstValueFrom(this.http.get('/assets/config.json'));
        
    }

 

    getConfig() : Observable<any>{
        return of ((window as any).config);

    }
    getApiUrl(): string{
        return (window as any).config?.apiUrl || 'http://localhost:7278';
        //return (window as any).config?.apiUrl || 'http://localhost:4240'; produccion
    }
}