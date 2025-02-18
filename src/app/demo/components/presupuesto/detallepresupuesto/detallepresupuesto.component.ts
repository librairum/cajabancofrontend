import { CommonModule, DatePipe } from '@angular/common';
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
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { GlobalService } from 'src/app/demo/service/global.service';

@Component({
    selector: 'app-detallepresupuesto',
    standalone: true,
    imports: [BreadcrumbModule, RouterModule, ToastModule, ConfirmDialogModule, TableModule, PanelModule, CalendarModule, InputTextModule, InputNumberModule,ButtonModule, CommonModule, FormsModule],
    templateUrl: './detallepresupuesto.component.html',
    styleUrl: './detallepresupuesto.component.css',
    providers: [MessageService,DatePipe]
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
    load: boolean = false;

    //variables de edición
    editingRow: Detallepresupuesto | null = null;
    isAnyRowEditing: boolean = false;
    editingIndex: number | null = null; // Índice de la fila en edición

    constructor(private gS:GlobalService,private messageService:MessageService,private presupuestoservice: PresupuestoService,private bs: BreadcrumbService, private router: Router, private ms: MessageService,private datePipe: DatePipe) {
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
        this.cargarDetalles()
        this.valoresCampos()
        this.calculateGroupTotals()


    }

    cargarDetalles(){
        this.load=true;
        this.presupuestoservice.obtenerDetallePresupuesto('01',this.navigationData.PagoNro).subscribe({
            next: (data) => {
                this.DetallePago=data;
                if (data.length === 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'No se encontraron detalles del presupuesto'
                    });
                } else {
                    this.load=false;
                }
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar presupuesto: ' + error.message
                });
            }
        })
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
            if (!acc[item.ban02Ruc]) {
                acc[item.ban02Ruc] = {
                    ruc: item.ban02Ruc,
                    razonsocial: item.razonsocial,
                    totalSoles: 0,
                    totalDolares: 0,
                    totalMontoPagarSoles: 0,
                    totalMontoPagarDolares: 0,
                    totalImporte: 0,
                    totalRetencion: 0,
                    totalPercepcion: 0,
                    totalNetoPagarSoles: 0,
                    totalNetoPagarDolares: 0,
                };
            }

            acc[item.ban02Ruc].totalSoles += item.ban02Soles || 0;
            acc[item.ban02Ruc].totalDolares += item.ban02Dolares || 0;
            acc[item.ban02Ruc].totalMontoPagarSoles += item.ban02PagoSoles || 0;
            acc[item.ban02Ruc].totalMontoPagarDolares += item.ban02PagoDolares || 0;
            acc[item.ban02Ruc].totalImporte += item.ban02ImporteDetraccionSoles || 0;
            acc[item.ban02Ruc].totalRetencion += item.ban02ImporteRetencionSoles || 0;
            acc[item.ban02Ruc].totalPercepcion += item.ban02ImporteSolesPercepcion || 0;
            acc[item.ban02Ruc].totalNetoPagarSoles += item.ban02SolesNeto || 0;
            acc[item.ban02Ruc].totalNetoPagarDolares += item.ban02DolaresNeto || 0;

            return acc;
        }, {});

        this.groupTotals = Object.values(groupedTotals);
    }

    calculateGroupTotal(ruc: string, field: string): number {
        return this.DetallePago
            .filter(item => item.ban02Ruc === ruc)
            .reduce((sum, item) => sum + (item[field] || 0), 0);
    }

    getTotalColumn(field: string): number {
        return this.DetallePago.reduce((sum, item) => sum + (item[field] || 0), 0);
    }

    DatosdeRegistro() {
        const formattedDate = this.datePipe.transform(this.fecha, 'dd/MM/yyyy');
        const navigationExtras = {
          state: {
            pagonro: this.pagnro,
            fechaformateada: formattedDate
          }
        };
        console.log(navigationExtras.state)
        this.router.navigate(['/Home/nuevo-presupuesto'], navigationExtras);
    }
    startEditing(detalle: Detallepresupuesto, index: number) {
        if (this.isAnyRowEditing) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Termina la edición actual antes de editar otra fila.'
            });
            return;
        }
        this.editingRow = { ...detalle }; // Copia los datos para editar
        this.editingIndex = index; // Guarda el índice de la fila
        this.isAnyRowEditing = true;
    }

    cancelEditing() {
        this.editingRow = null;
        this.editingIndex = null;
        this.isAnyRowEditing = false;
    }

    saveEditing() {
        if (this.editingRow && this.editingIndex !== null) {
            const payload = this.buildBackendPayload(this.editingRow);
            this.presupuestoservice.actualizarDetallePresupuesto(payload).subscribe({
                next: (response) => {
                    // Actualiza la fila en la lista original
                    this.DetallePago[this.editingIndex] = { ...this.editingRow };
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Detalle actualizado correctamente'
                    });
                    this.cancelEditing();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar: ' + error.message
                    });
                }
            });
        }
    }

    buildBackendPayload(detalle: Detallepresupuesto): any {
        return {
            ban02Empresa: this.gS.getCodigoEmpresa(),
            ban02Ruc: detalle.ban02Ruc,
            ban02Tipodoc: detalle.nombreTipoDocumento || "01",
            ban02NroDoc: detalle.ban02NroDoc,
            ban02Codigo: detalle.ban02Codigo || "COD001",
            razonSocial: detalle.razonsocial,
            nombreMoneda: detalle.nombremoneda,
            nombreTipoDocumento: detalle.nombreTipoDocumento,
            ban02Numero: this.pagnro || "NUM001",
            ban02Fecha: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
            ban02TipoCambio: 0,
            ban02TipoAplic: "01",
            ban02Moneda: detalle.ban02Moneda || "PEN",
            ban02Soles: detalle.ban02Soles,
            ban02Dolares: detalle.ban02Dolares,
            ban02SolesVale: 0,
            ban02DolaresVale: 0,
            ban02Concepto: detalle.razonsocial,
            ban02GiroOrden: "No se",
            ban02BcoLiquidacion: "00",
            ban02Redondeo: "0",
            ban02Usuario: this.gS.getNombreUsuario(),
            ban02Pc: "PC001",
            ban02FechaRegistro: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            ban02Estado: "ElabP",
            ban02EstadoTemp: "P",
            ban02pagosoles: detalle.ban02PagoSoles,
            ban02PagoDolares: detalle.ban02PagoDolares,
            ban02TasaDetraccion: detalle.ban02Tasadetraccion,
            ban02ImporteDetraccionSoles: detalle.ban02ImporteDetraccionSoles,
            ban02ImporteDetraccionDolares: detalle.ban02ImporteDetraccionDolares,
            ban02TasaRetencion: detalle.ban02TasaRetencion,
            ban02ImporteRetencionSoles:  detalle.ban02ImporteRetencionSoles,
            ban02ImporteRetencionDolares: detalle.ban02ImporteRetencionDolares,
            ban02TasaPercepcion: detalle.ban02TasaPercepcion,
            ban02ImportePercepcionSoles: detalle.ban02ImportePercepcionSoles,
            ban02ImportePercepcionDolares: detalle.ban02ImportePercepcionDolares
        };
    }




}
