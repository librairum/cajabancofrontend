import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { Detallepresupuesto } from '../presupuesto';


@Component({
    selector: 'app-detallepresupuesto',
    standalone: true,
    imports: [BreadcrumbModule, RouterModule, ToastModule, ConfirmDialogModule, TableModule, PanelModule, CalendarModule, InputTextModule, ButtonModule, CommonModule, FormsModule],
    templateUrl: './detallepresupuesto.component.html',
    styleUrl: './detallepresupuesto.component.css',
    providers: [MessageService]
})
export class DetallepresupuestoComponent implements OnInit {
    DetallePago: Detallepresupuesto[] = []
    navigationData: any;
    items: any[] = [];
    pagnro: string;
    fechaString: string;
    fecha: Date
    motivo: string;
    medio: string;
    groupTotals:any[] = [];

    constructor(private bs: BreadcrumbService, private router: Router, private ms: MessageService) {
        const navigation = router.getCurrentNavigation();
        if (navigation?.extras?.state) {
            this.navigationData = navigation.extras.state;
        } else {
            this.router.navigate(['Home/presupuesto']);
        }
    }

    ngOnInit(): void {
        this.bs.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            { label: 'Presupuesto', routerLink: '/Home/presupuesto'/*, command: () => this.volverAListado()*/ },
            { label: 'Detalle presupuesto ', routerLink: '/Home/detalle-presupuesto' }
        ]);
        this.bs.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })
        this.valoresCampos()
        this.DetallePago = [

            { item: 1, ruc: '204532455', razonsocial: 'Ivan Systems', TipoDoc: 'factura', Numero: 'E001-2345', MonedaOriginal: 'Soles', importetotalsoles: 1000.00, importetotaldolares: 264.55, Montopagarsoles: 600.00, montopagardolares: 158.73, detracciontipo: null, detracciontasa: '12%', detraccionimporte: 120.00, retencion: null, percepcion: null, netopagasoles: 480.00, netopagadolares: 126.98 },
            { item: 2, ruc: '201234567', razonsocial: 'Ivan Systems', TipoDoc: 'factura', Numero: 'E001-3456', MonedaOriginal: 'Soles', importetotalsoles: 300.00, importetotaldolares: 79.37, Montopagarsoles: 300.00, montopagardolares: null, detracciontipo: null, detracciontasa: '12%', detraccionimporte: 36.00, retencion: null, percepcion: null, netopagasoles: 264.00, netopagadolares: 69.84 },
            { item: 3, ruc: '201234567', razonsocial: 'William Tech', TipoDoc: 'factura', Numero: 'E001-3458', MonedaOriginal: 'Soles', importetotalsoles: 550.00, importetotaldolares: 145.50, Montopagarsoles: null, montopagardolares: null, detracciontipo: null, detracciontasa: '12%', detraccionimporte: 66.00, retencion: null, percepcion: null, netopagasoles: 484.00, netopagadolares: 128.04 },
            { item: 4, ruc: '201234567', razonsocial: 'William Tech', TipoDoc: 'factura', Numero: 'E001-3445', MonedaOriginal: 'Soles', importetotalsoles: 150.00, importetotaldolares: 39.68, Montopagarsoles: null, montopagardolares: null, detracciontipo: null, detracciontasa: '12%', detraccionimporte: 18.00, retencion: null, percepcion: null, netopagasoles: 132.00, netopagadolares: 34.92 }

        ];
        this.calculateGroupTotals()


    }

    valoresCampos() {
        this.pagnro = this.navigationData?.PagoNro || '';
        this.fechaString = this.navigationData?.Fecha;
        if (this.fechaString) {
            const [day, month, year] = this.fechaString.split('/').map(Number);
            this.fecha = new Date(year, month - 1, day); // Mes comienza desde 0
        } else {
            this.fecha = null; // O un valor predeterminado
        }
        this.motivo = this.navigationData?.motivo || '';
        this.medio = this.navigationData?.mediopago || '';
    }

    calculateGroupTotals() {
        const groupedTotals = this.DetallePago.reduce((acc, item) => {
            if (!acc[item.razonsocial]) {
                acc[item.razonsocial] = {
                    razonsocial: item.razonsocial,
                    totalSoles: 0,
                    totalDolares: 0,
                    totalMontoPagarSoles: 0,
                    totalMontoPagarDolares: 0,
                    totalImporte:0,
                    totalRetencion:0,
                    totalPercepcion:0,
                    totalNetoPagarSoles: 0,
                    totalNetoPagarDolares: 0,
                };
            }

            acc[item.razonsocial].totalSoles += item.importetotalsoles || 0;
            acc[item.razonsocial].totalDolares += item.importetotaldolares || 0;

            acc[item.razonsocial].totalMontoPagarSoles += item.Montopagarsoles || 0;
            acc[item.razonsocial].totalMontoPagarDolares += item.montopagardolares || 0;
            acc[item.razonsocial].totalImporte += item.detraccionimporte || 0;
            acc[item.razonsocial].totalRetencion += item.retencion || 0;
            acc[item.razonsocial].totalPercepcion += item.percepcion || 0;

            acc[item.razonsocial].totalNetoPagarSoles += item.netopagasoles || 0;
            acc[item.razonsocial].totalNetoPagarDolares += item.netopagadolares || 0;

            return acc;
        }, {});

        this.groupTotals = Object.values(groupedTotals);
    }

    calculateGroupTotal(razonsocial: string, field: string): number {
        return this.DetallePago
            .filter(item => item.razonsocial === razonsocial)
            .reduce((sum, item) => sum + (item[field] || 0), 0);
    }

    getTotalColumn(field: string): number {
        return this.DetallePago.reduce((sum, item) => sum + (item[field] || 0), 0);
    }



}
