import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import {
    Detallepresupuesto,
    VoucherContableCabecera,
    VoucherContableDetalle,
} from '../presupuesto';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { GlobalService } from 'src/app/demo/service/global.service';
import { ActualizarVouchercontableComponent } from "../actualizar-vouchercontable/actualizar-vouchercontable.component";

@Component({
    selector: 'app-vouchercontable',
    standalone: true,
    imports: [
        BreadcrumbModule,
        RouterModule,
        ToastModule,
        ConfirmDialogModule,
        TableModule,
        PanelModule,
        CalendarModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        CommonModule,
        FormsModule,
        DialogModule,
        ActualizarVouchercontableComponent
    ],
    templateUrl: './vouchercontable.component.html',
    styleUrl: './vouchercontable.component.css',
    providers: [MessageService, DatePipe],
})
export class VouchercontableComponent implements OnInit {
    voucherContableDetalle: VoucherContableDetalle[] = [];
    voucherContableCabecera: VoucherContableCabecera[] = [];
    navigationData: any;
    items: any[] = [];
    libro: string;
    libro_numero: string;
    fechaString: string;
    groupTotals: any[] = [];
    load: boolean = false;
    displayAgregarModal: boolean = false;

    editingRow: VoucherContableDetalle | null = null;
    isAnyRowEditing: boolean = false;
    editingIndex: number | null = null; // Índice de la fila en edición
    // fecha hoy
    fechahoy: Date;
    detalleSelected: VoucherContableDetalle;


    verConfirmarActualizacion: boolean = false;
    selectedVoucherC: string;


    constructor(
        private messageService: MessageService,
        private presupuestoservice: PresupuestoService,
        private bs: BreadcrumbService,
        private router: Router,
    ) {
        //variables de edición

        const navigation = router.getCurrentNavigation();
        if (navigation?.extras?.state) {
            this.navigationData = navigation.extras.state;
        } else {
            this.router.navigate(['Home/presupuesto']);
        }
    }

    ngOnInit(): void {
        this.bs.clearBreadcrumbs();
        this.bs.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            { label: 'Presupuesto', routerLink: '/Home/presupuesto' },
            { label: 'Voucher contable', routerLink: '/Home/voucher_contable' },
        ]);
        this.bs.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });

        this.cargarDatos();

    }

    cargarDatos() {
        //cargar cabecera voucher contable
        this.presupuestoservice
            .obtenerVoucherContableCabecera(this.navigationData.empresa, this.navigationData.PagoNro)
            .subscribe({
                next: (data) => {
                    this.voucherContableCabecera = data;
                    this.libro = this.voucherContableCabecera[0]?.libro ?? '';

                    this.libro_numero =
                        this.voucherContableCabecera[0]?.numero ?? '';
                    console.log(
                        'Cabecera data: ',
                        this.voucherContableCabecera
                    );
                    if (data.length === 0) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'No se encontró libro de nrovoucher',
                        });
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al cargar cabecera: ' + error.message,
                    });
                },
            });
        //cargar tabla detalle voucher contable
        this.load = true;
        this.presupuestoservice
            .obtenerVoucherContableDetalle(this.navigationData.empresa, this.navigationData.PagoNro) //empresa y pago numero
            .subscribe({
                next: (data) => {
                    this.voucherContableDetalle = data;
                    console.log(
                        'Voucher contable detalle data: ',
                        this.voucherContableDetalle
                    );
                    if (data.length === 0) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Advertencia',
                            detail: 'No se encontraron voucher contables',
                        });
                        this.load = false;
                    } else {
                        this.load = false;
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al cargar voucher contables: ' + error.message,
                    });
                },
            });
    }

    ActualizarVoucherContable(vc: VoucherContableDetalle) {
        this.detalleSelected = vc;
        this.verConfirmarActualizacion = true;
    }

    onCloseModal() {
        /*
        if (this.confirmarpagocomponente) {
            this.confirmarpagocomponente.limpiar();
        }
        this.verConfirmarActualizacion = false;
        this.cargarMedioPago();
        this.gS.selectedDate$.subscribe(date => {
            if (date) {
                const year = date.getFullYear().toString();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                this.cargarPresupuesto(this.gS.getCodigoEmpresa(), year, month);
            }
        });
        */
    }

    // Añade estos métodos a tu clase VouchercontableComponent

    // Métodos corregidos para la clase VouchercontableComponent

calcularTotalDebe(): number {
    return this.voucherContableDetalle
        .reduce((sum, item) => sum + (Number(item.importeDebe) || 0), 0);
}

calcularTotalHaber(): number {
    return this.voucherContableDetalle
        .reduce((sum, item) => sum + (Number(item.importeHaber) || 0), 0);
}

calcularTotalCargo(): number {
    return this.voucherContableDetalle
        .reduce((sum, item) => sum + (Number(item.importeDebeEquivalencia) || 0), 0);
}

calcularTotalAbono(): number {
    return this.voucherContableDetalle
        .reduce((sum, item) => sum + (Number(item.importeHaberEquivalencia) || 0), 0);
}


}
