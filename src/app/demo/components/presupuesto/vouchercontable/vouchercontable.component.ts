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
    detalleSelected:VoucherContableDetalle;

    
    verConfirmarActualizacion: boolean = false;
    selectedVoucherC: string;
    constructor(
        private messageService: MessageService,
        private presupuestoservice: PresupuestoService,
        private bs: BreadcrumbService,
        private router: Router,
        private ms: MessageService,
        private datePipe: DatePipe,
        private confirmationService: ConfirmationService,
        private gS: GlobalService
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
            .obtenerVoucherContableCabecera('01', '00232')
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
                            detail: 'No se encontró cabecera',
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
            .obtenerVoucherContableDetalle('01', '00232')
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
                            detail: 'No se encontraron detalles del presupuesto',
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
                        detail: 'Error al cargar presupuesto: ' + error.message,
                    });
                },
            });
    }

    ActualizarVoucherContable(vc: VoucherContableDetalle) {
        this.detalleSelected=vc;
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
}
