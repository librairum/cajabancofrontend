import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { cabeceraPresupuesto } from '../presupuesto';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-cabecerapresupuesto',
    standalone: true,
    imports: [BreadcrumbModule, ToastModule, PanelModule, ConfirmDialogModule, TableModule, CommonModule,ButtonModule,RouterModule],
    templateUrl: './cabecerapresupuesto.component.html',
    styleUrl: './cabecerapresupuesto.component.css',
    providers: [ConfirmationService, MessageService]
})
export class CabecerapresupuestoComponent implements OnInit {
    //breadcrumb
    items: any[] = []
    prueba!: any[];
    presupuesto: cabeceraPresupuesto[] = []


    constructor(private bS: BreadcrumbService, private confirmationService: ConfirmationService,private router:Router) { }

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            { label: 'Presupuesto', routerLink: '/Home/presupuesto' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })
        this.presupuesto = [
            {PagoNro: '0001', Fecha: null, motivo: null, mediopago: null, brutopagarsoles: 1000.00, brutopagardolares: 264.55, afectodetraccion: null, afectoretencion: null, afectopercepcion: null, netopagosoles: 1000.00, netopagodolares: 264.55, estado: 'Por pagar', enlaceadjunto: 'transfe.jpg'},
            {PagoNro: '0002', Fecha: '21/01/2025', motivo: 'Pago quincena ·1 bpc', mediopago: 'Transferencia bancaria BCP', brutopagarsoles: 2000.00, brutopagardolares: 529.10, afectodetraccion: 240.00, afectoretencion: null, afectopercepcion: null, netopagosoles: 1760.00, netopagodolares: 465.61, estado: 'Por pagar', enlaceadjunto: 'transfe.jpg'},
            {PagoNro: '0009', Fecha: '21/01/2025', motivo: 'Pago quinecea 1 Interbank', mediopago: 'Transferencia bancaria Interbank', brutopagarsoles: 3000.00, brutopagardolares: 763.65, afectodetraccion: null, afectoretencion: 90.00, afectopercepcion: null, netopagosoles: 2910.00, netopagodolares: 769.84, estado: 'Pagado', enlaceadjunto: 'transfe.jpg'},
            {PagoNro: '000,', Fecha: '21/01/2025', motivo: 'pago contratostas BiF', mediopago: 'Transferencia bancaria BIF', brutopagarsoles: 4000.00, brutopagardolares: 1058.20, afectodetraccion: null, afectoretencion: 120.00, afectopercepcion: null, netopagosoles: 3880.00, netopagodolares: 1025.46, estado: 'Pagado', enlaceadjunto: 'transfe.jpg'},
            {PagoNro: '0005', Fecha: '20/01/2025', motivo: 'pago transporte bif', mediopago: 'Cheque BCP', brutopagarsoles: 300.00, brutopagardolares: 79.37, afectodetraccion: null, afectoretencion: null, afectopercepcion: null, netopagosoles: 300.00, netopagodolares: 79.37, estado: 'Pagado', enlaceadjunto: 'transfe.jpg'},
            {PagoNro: '0006', Fecha: '20/01/2025', motivo: 'pago casa daniel', mediopago: 'Caja Chica Ehfectivo', brutopagarsoles: 100.00, brutopagardolares: 26.46, afectodetraccion: null, afectoretencion: null, afectopercepcion: null, netopagosoles: 100.00, netopagodolares: 26.46, estado: 'Pagado', enlaceadjunto: 'transfe.jpg'}
        ]


    }

    verDetalles(presupuesto: cabeceraPresupuesto){
        const navigationExtras={
            state:{
                PagoNro:presupuesto.PagoNro,
                Fecha:presupuesto.Fecha,
                motivo:presupuesto.motivo,
                mediopago:presupuesto.mediopago
            }
        }
        console.log(navigationExtras.state)
        this.router.navigate(['Home/detalle-presupuesto'],navigationExtras)

    }
}
