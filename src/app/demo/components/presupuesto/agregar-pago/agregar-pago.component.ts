import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { GlobalService } from 'src/app/demo/service/global.service';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { agregar_Pago, proveedores_lista } from '../presupuesto';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-agregar-pago',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, BreadcrumbModule, ToastModule, PanelModule, ConfirmDialogModule, TableModule, CommonModule, ButtonModule, RouterModule, CalendarModule, DropdownModule],
    templateUrl: './agregar-pago.component.html',
    styleUrl: './agregar-pago.component.css',
    providers: [ConfirmationService, MessageService, DatePipe]
})
export class AgregarPagoComponent implements OnInit {

    filtroFRM: FormGroup;

    items: any[] = []
    loading: boolean = false
    ayudapago: agregar_Pago[] = []
    proveedores: proveedores_lista[] = []

    constructor(private fb: FormBuilder, private gS: GlobalService, private bS: BreadcrumbService, private confirmationService: ConfirmationService, private router: Router, private presupuestoService: PresupuestoService, private messageService: MessageService, private datePipe: DatePipe) {
        this.filtroFRM = fb.group({
            empresa: ['', [Validators.required]],
            fechavencimiento: [new Date(), [Validators.required]],
            ruc: ['', [Validators.required]],
        })
    }

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            { label: 'Presupuesto', routerLink: '/Home/presupuesto' },
            { label: 'Agregar Pago', routerLink: '/Home/nuevo-presupuesto' },
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.items = bc;
        })
        this.cargarproveedores();
        this.cargarayudaparaagregarpago();

    }

    cargarayudaparaagregarpago(): void {
        this.loading = true;
        const fechaFormateda=this.datePipe.transform(this.filtroFRM.get('fechavencimiento').value,'dd/MM/yyyy');
        this.presupuestoService.obtenerDocPendiente(this.gS.getCodigoEmpresa(), fechaFormateda, this.filtroFRM.get('ruc').value).subscribe({
            next: (data) => {
                this.ayudapago = data;
                this.loading = false;
                if (data.length === 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'No se encontraron registros del proveedor'
                    });
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar los registros: ' + error.message
                });
            }
        })
    }

    cargarproveedores() {
        const cod_empresa = this.gS.getCodigoEmpresa();
        this.presupuestoService.obtenerProveedores(cod_empresa).subscribe(
            (data: proveedores_lista[]) => {
                this.proveedores = data;
                if(data.length > 0) {
                    this.filtroFRM.patchValue({
                        ruc: data[0].ruc
                    });
                    // Cargamos los datos iniciales
                    this.cargarayudaparaagregarpago();
                }
            }
        )
    }

    onProveedorChallenge(event: any) {
        this.filtroFRM.patchValue({
            ruc: event.value
        })
    }

    filtrar(){
        this.cargarayudaparaagregarpago()
    }
}
