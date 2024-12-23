import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private lS: LoginService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.lS.isLoggedIn()) {
      return true; // Permitir el acceso si el usuario está autenticado
    }

    // Si no está autenticado, redirigir al LoginComponent
    this.router.navigate(['/']); // Redirigir a la página de login
    return false; // Bloquear el acceso
  }
}
