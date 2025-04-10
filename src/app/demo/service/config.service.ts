import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: any = {}; // Inicialmente vacío

    constructor(private http: HttpClient) {

    }

    async loadConfig(): Promise<void> {
        console.log("Cargando configuración desde config.json...");
        try {
            this.config = await firstValueFrom(this.http.get('/assets/config.json'));
            (window as any).config = this.config; // Guardar en window para acceso global
            console.log(" Configuración cargada:", this.config);
        } catch (error) {
            console.error(" Error cargando config.json", error);
        }
    }

    getConfig() : Observable<any>{
        return of ((window as any).config);

    }
    getApiUrl(): string{

        // return (window as any).config?.apiUrl || 'http://192.168.1.44:7277'; //produccion
        return this.config?.url || 'https://localhost:7277'; // Valor por defecto // verificar si va se http o https

    }

    getRutaDoc(): string{
        return this.config?.rutaDoc;
    }
}
