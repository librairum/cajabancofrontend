import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { LoginComponent } from './demo/components/login/login.component';
import { CabecerapresupuestoComponent } from './demo/components/presupuesto/cabecerapresupuesto/cabecerapresupuesto.component';
import { DetallepresupuestoComponent } from './demo/components/presupuesto/detallepresupuesto/detallepresupuesto.component';
import { CuentaBancariaComponent } from './demo/components/cuenta-bancaria/cuenta-bancaria.component';
import { AgregarPagoComponent } from './demo/components/presupuesto/agregar-pago/agregar-pago.component';
import { BancoComponent } from './demo/components/banco/banco.component';
import { MediopagoComponent } from './demo/components/mediopago/mediopago.component';
import { VouchercontableComponent } from './demo/components/presupuesto/vouchercontable/vouchercontable.component';
import { PerfilComponent } from './demo/components/perfil/perfil.component';
import { PermisosxperfilxtodoComponent } from './demo/components/permisosxperfilxtodo/permisosxperfilxtodo.component';
import { ConsultaDocPorPagoComponent } from './demo/components/consulta-doc-por-pago/consulta-doc-por-pago.component';
import { CuentaComponent } from './demo/components/cuenta/cuenta.component';
import { ConsultaDocPendienteReporteComponent } from './demo/components/consulta-doc-pendiente-reporte/consulta-doc-pendiente-reporte.component';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', redirectTo: 'Inicio_Sesion', pathMatch: 'full'
            },
            {
                path: 'Inicio_Sesion', component: LoginComponent
            },
            {
                path: 'Home', component: AppLayoutComponent, //canActivate:[AuthGuard],
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'banco', component: BancoComponent },
                    { path: 'cuentas_bancarias', component: CuentaBancariaComponent },
                    { path: 'presupuesto', component: CabecerapresupuestoComponent },
                    { path: 'detalle-presupuesto', component: DetallepresupuestoComponent },
                    { path: 'nuevo-presupuesto', component: AgregarPagoComponent },
                    { path: 'medio_pago', component: MediopagoComponent },
                    { path: 'voucher_contable', component: VouchercontableComponent },
                    { path: 'perfil', component: PerfilComponent },
                    { path: 'asignarpermiso', component: PermisosxperfilxtodoComponent },
                    { path: 'ConsultaDocPorPago', component: ConsultaDocPorPagoComponent },
                    { path: 'cuenta', component: CuentaComponent },
                    { path:'ConsultaDocPendienteReporte', component:ConsultaDocPendienteReporteComponent} ,

                ]
            },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
