import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LoginComponent } from './demo/components/login/login.component';
import { NumeroCuentaComponent } from './demo/components/numero-cuenta/numero-cuenta.component';
import { CabecerapresupuestoComponent } from './demo/components/presupuesto/cabecerapresupuesto/cabecerapresupuesto.component';
import { DetallepresupuestoComponent } from './demo/components/presupuesto/detallepresupuesto/detallepresupuesto.component';
import { AuthGuard } from './demo/service/auth.guard';
import { CuentaBancariaComponent } from './demo/components/cuenta-bancaria/cuenta-bancaria.component';
import { AgregarPagoComponent } from './demo/components/presupuesto/agregar-pago/agregar-pago.component';
import { BancoComponent } from './demo/components/banco/banco.component';
import { MediopagoComponent } from './demo/components/mediopago/mediopago.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', redirectTo: 'Inicio_Sesion', pathMatch: 'full'
            },
            {
                path:'Inicio_Sesion',component:LoginComponent
            },
            {
                path: 'Home', component: AppLayoutComponent, //canActivate:[AuthGuard],
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'banco', component: BancoComponent },
                    { path: 'cuentas_bancarias', component: CuentaBancariaComponent },
                    { path: 'numero_cuenta', component: NumeroCuentaComponent },
                    {path:'presupuesto',component: CabecerapresupuestoComponent},
                    {path:'detalle-presupuesto',component: DetallepresupuestoComponent},
                    {path:'nuevo-presupuesto',component: AgregarPagoComponent},
                    {path:'medio_pago', component:MediopagoComponent}
                    
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
