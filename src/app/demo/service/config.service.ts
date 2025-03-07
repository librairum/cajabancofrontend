import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config$ = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) {
        this.loadConfig();
    }

    private async loadConfig() {
        const configData = await firstValueFrom(this.http.get('/assets/config.json'));
        this.config$.next(configData);
    }

    getConfig(): any {
        return this.config$.getValue();
    }

    getConfigObservable() {
        return this.config$.asObservable();
    }
}
