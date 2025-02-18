import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { GlobalService } from 'src/app/demo/service/global.service';

@Component({
    selector: 'app-detallepresupuesto',
    standalone: true,
    imports: [BreadcrumbModule, RouterModule, ToastModule, ConfirmDialogModule, TableModule, PanelModule, CalendarModule, InputTextModule, ButtonModule, CommonModule, FormsModule],
    templateUrl: './detallepresupuesto.component.html',
    styleUrl: './detallepresupuesto.component.css',
    providers: [ConfirmationService,MessageService,DatePipe]
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

    constructor(private messageService:MessageService,
        private presupuestoservice: PresupuestoService,
        private bs: BreadcrumbService, private router: Router, 
        private ms: MessageService,
        private datePipe: DatePipe,
    private confirmationService: ConfirmationService, private gS: GlobalService) {
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


    eliminarPago(detalle : Detallepresupuesto) {
        console.log(detalle);
            this.confirmationService.confirm({
                message: `
                    <div class="text-center">
                        <i class="pi pi-exclamation-circle" style="font-size: 2rem; color: var(--yellow-500); margin-bottom: 1rem; display: block;"></i>
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">¿Está seguro de eliminar el presupuesto?</p>
                        <p style="color: var(--text-color-secondary);">Número de pago: ${this.navigationData.PagoNro}</p>
                        <p style="color: var(--text-color-secondary);">Número de detalle: ${detalle.ban02Codigo}</p>
                        <p style="color: var(--text-color-secondary);">Fecha: ${this.fechaString}</p>
                        <p style="margin-top: 1rem; color: var(--text-color-secondary);">Esta acción no se puede deshacer</p>
                    </div>
                `,
                header: 'Confirmar Eliminación',
                //icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí, eliminar',
                rejectLabel: 'No, cancelar',
                acceptButtonStyleClass: 'p-button-danger p-button-raised',
                rejectButtonStyleClass: 'p-button-outlined p-button-raised',
                accept: () => {
                    const empresa = this.gS.getCodigoEmpresa();
                    //const numero = presupuesto.pagoNumero;
                    const numeroPresupuesto = this.navigationData.PagoNro;
                    const numeroPresupuestoDetalle = detalle.ban02Codigo;
                    this.presupuestoservice.eliminarPresupuestoDetalle(empresa,
                         numeroPresupuesto, numeroPresupuestoDetalle).subscribe({
                            next: (response) =>{
                                if(response.isSuccess){
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: 'Presupuesto detalle eliminado correctamente'
                                    });
                                    this.cargarDetalles();
                                    
                                }else{
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: response.message || 'Error al eliminar el presupuesto'                                   
                                    });
                                }
                            },
                            error: (error) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Error al eliminar el presupuesto: ' + error.message
                                });
                            }

                         });                
                }
            });
        }



}
