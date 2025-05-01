import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private config: any = {}; // Inicialmente vacío

    constructor(private http: HttpClient) {}

    async loadConfig(): Promise<void> {
        // console.log("Cargando configuración desde config.json...");
        try {
            this.config = await firstValueFrom(
                this.http.get('/assets/config.json')
            );
            (window as any).config = this.config; // Guardar en window para acceso global
            // console.log(" Configuración cargada:", this.config);
        } catch (error) {
            console.error(' Error cargando config.json', error);
        }
    }

    getConfig(key: string): any {
        return (window as any).config ? (window as any).config[key] : null;
    }

    getApiUrl(): string {
        return this.getConfig('url'); // Valor por defecto // verificar si va se http o https
    }

    getRutaDoc(): string {
        return this.getConfig('rutaDoc');
    }

    getVersion(): string {
        return this.getConfig('appVersion');
    }

    getTheme(): string {
        return this.getConfig('theme');
    }

    getCodigoModulo(): string {
        return this.getConfig('codigoModulo');
    }

    getEstado() {
        return this.getConfig('estado');
    }

    getTipoAplicacion(): string {
        return this.getConfig('tipoAplicacion');
    }
}
