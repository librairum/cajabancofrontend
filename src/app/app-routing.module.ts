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
import { DetraccionMasivaComponent } from './demo/components/detraccion/detraccion-masiva/detraccion-masiva.component';
import { DetraccionIndividualComponent } from './demo/components/detraccion/detraccion-individual/detraccion-individual.component';
import { DetraccionMasivaPresupuestoDetComponent } from './demo/components/detraccion/detraccion-masiva-presupuesto-det/detraccion-masiva-presupuesto-det.component';
import { DetraccionMasivaDetComponent } from './demo/components/detraccion/detraccion-masiva-det/detraccion-masiva-det.component';
import { PagoRetencionComponent } from './demo/components/retencion/pago-retencion/pago-retencion.component';
import { ConsultadocpendienteCtaxcobrarComponent } from './demo/components/consultadocpendiente-ctaxcobrar/consultadocpendiente-ctaxcobrar.component';
import { ConsultahistoricaCtaxcobrarComponent } from './demo/components/consultahistorica-ctaxcobrar/consultahistorica-ctaxcobrar.component';
import { DetraccionIndividualDetComponent } from './demo/components/detraccion/detraccion-individual-det/detraccion-individual-det.component';
import { RetencionDetalleComponent } from './demo/components/retencion/retencion-detalle/retencion-detalle.component';
import { RetencionDetallePresupuestoComponent } from './demo/components/retencion/retencion-detalle-presupuesto/retencion-detalle-presupuesto.component';
import { RegistroCobroComponent } from './demo/components/cobrofactura/registro-cobro/registro-cobro.component';
import { RegistroCobroDetalleComponent } from './demo/components/cobrofactura/registro-cobro-detalle/registro-cobro-detalle.component';
import { AgregaFacturaxcobrarComponent } from './demo/components/cobrofactura/agrega-facturaxcobrar/agrega-facturaxcobrar.component';
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
                    {path:'detraccion_masiva', component:DetraccionMasivaComponent},
                    {path:'detraccion_individual', component:DetraccionIndividualComponent},
                    {path:'detraccion_masiva_presupuesto_det' , component:DetraccionMasivaPresupuestoDetComponent},
                    {path:'detraccion_masiva_det', component:DetraccionMasivaDetComponent},
                    {path:'pago_retencion', component:PagoRetencionComponent},
                    {path:'consultadocpendiente_ctaxcobrar', component:ConsultadocpendienteCtaxcobrarComponent},
                    {path:'consultahistorica_ctaxcobrar', component:ConsultahistoricaCtaxcobrarComponent}
                    ,{path:'detraccion_individual_det', component:DetraccionIndividualDetComponent}
                    ,{path:'retencion-detalle',component:RetencionDetalleComponent}
                    ,{path:'retencion-presupuesto-detalle', component:RetencionDetallePresupuestoComponent}
                    ,{path:'registro_cobro', component:RegistroCobroComponent}
                    ,{path:'registro_cobro_detalle', component:RegistroCobroDetalleComponent},
                    ,{path:'agrega_facturaxcobrar', component:AgregaFacturaxcobrarComponent}
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
