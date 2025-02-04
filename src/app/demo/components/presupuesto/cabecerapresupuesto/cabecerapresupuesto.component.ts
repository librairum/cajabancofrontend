import { CommonModule, DatePipe } from '@angular/common';
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
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { RespuestaAPI } from 'src/app/demo/service/login.service';
import { GlobalService } from 'src/app/demo/service/global.service';

@Component({
    selector: 'app-cabecerapresupuesto',
    standalone: true,
    imports: [BreadcrumbModule, ToastModule, PanelModule, ConfirmDialogModule, TableModule, CommonModule,ButtonModule,RouterModule],
    templateUrl: './cabecerapresupuesto.component.html',
    styleUrl: './cabecerapresupuesto.component.css',
    providers: [ConfirmationService, MessageService,DatePipe]
})
export class CabecerapresupuestoComponent implements OnInit {
    //breadcrumb
    items: any[] = []
    prueba!: any[];
    presupuesto: cabeceraPresupuesto[] = []
    loading:boolean = false


    constructor(private gS:GlobalService,private bS: BreadcrumbService, private confirmationService: ConfirmationService,private router:Router, private presupuestoService:PresupuestoService,private messageService: MessageService, private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            { label: 'Presupuesto', routerLink: '/Home/presupuesto' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })

        this.gS.selectedDate$.subscribe(date => {
            if (date) {
                const year = date.getFullYear().toString();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                this.cargarPresupuesto(this.gS.getCodigoEmpresa(), year, month);
            }
        });



    }

    cargarPresupuesto(empresa: string, anio: string, mes: string): void {
        this.loading = true;
        this.presupuestoService.obtenerPresupuesto(empresa, anio, mes).subscribe({
            next: (data) => {
                this.presupuesto = data;
                this.loading = false;
                if (data.length === 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'No se encontraron registros de presupuesto'
                    });
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar presupuesto: ' + error.message
                });
            }
        });
    }

    verDetalles(presupuesto: cabeceraPresupuesto){
        const formattedDate = this.datePipe.transform(presupuesto.fecha, 'dd/MM/yyyy');
        const navigationExtras={
            state:{
                PagoNro:presupuesto.pagoNumero,
                Fecha:formattedDate,
                motivo:presupuesto.motivo,
                mediopago:presupuesto.mediopago
            }
        }
        console.log(navigationExtras.state)
        this.router.navigate(['Home/detalle-presupuesto'],navigationExtras)

    }
}
