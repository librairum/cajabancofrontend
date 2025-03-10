import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
if (environment.production) {
  enableProdMode();
}
// Iniciar Angular solo después de cargar la configuración

function loadConfig(): Promise<any> {
    return fetch('/assets/config.json')
      .then(response => response.json())
      .then(config => {
        (window as any).config = config;
        
        return config; // Devuelve la configuración para que se pueda usar en el siguiente paso
      })
      .catch(() => {
        console.error("Error al cargar config.json, usando valores por defecto.");
        const defaultConfig = { apiUrl: 'http://localhost:7277' };
        //const defaultConfig = { apiUrl: 'http://localhost:4240' }; // produccion
        (window as any).config = defaultConfig;
        return defaultConfig; // Devuelve la configuración por defecto
      });
  }
  
  loadConfig().then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });