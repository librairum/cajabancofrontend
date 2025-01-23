import { CuentaBancariaComponent } from './demo/components/cuenta-bancaria/cuenta-bancaria.component';
import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LoginComponent } from './demo/components/login/login.component';
import { AuthGuardService } from './demo/service/auth-guard.service';
import { NumeroCuentaComponent } from './demo/components/numero-cuenta/numero-cuenta.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path:'',component:LoginComponent
            },
            {
                path: 'Home', component: AppLayoutComponent,
                // canActivate:[AuthGuardService],
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'banco', component: NumeroCuentaComponent },
                    {
                        path: 'banco/cuentas', component: CuentaBancariaComponent
                        //path: 'banco/cuentas/',
                        //path: 'banco/:idBanco/cuentas/:descripcion', // Ruta para acceder a las cuentas de un banco específico
                        //loadChildren: () => import('./demo/components/cuenta-bancaria/cuentaBancaria.module').then(m => m.CuentaBancariaModule)
                    },
                    //{ path: 'cuentas_bancarias', loadChildren: () => import('./demo/components/cuenta-bancaria/cuentaBancaria.module').then(m => m.CuentaBancariaModule)},
                    { path: 'numero_cuenta', component: NumeroCuentaComponent }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
