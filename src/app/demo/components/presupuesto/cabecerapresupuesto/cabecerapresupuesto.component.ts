import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { cabeceraPresupuesto, insert_presupuesto } from '../presupuesto';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { RespuestaAPI } from 'src/app/demo/service/login.service';
import { GlobalService } from 'src/app/demo/service/global.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-cabecerapresupuesto',
    standalone: true,
    imports: [BreadcrumbModule, ToastModule, PanelModule, ConfirmDialogModule, TableModule, CommonModule,ButtonModule,RouterModule,FormsModule,CalendarModule,InputTextModule,InputNumberModule,DropdownModule,ReactiveFormsModule],
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
    mostrarNuevaFila: boolean = false;
    botonesDeshabilitados: boolean = false;

    nuevoPresupuesto: insert_presupuesto = {
        ban01Empresa: '',
        ban01Numero: '',
        ban01Anio: '',
        ban01Mes: '',
        ban01Descripcion: '',
        ban01Fecha: '',
        ban01Estado: '01',
        ban01Usuario: '',
        ban01Pc: '',
        ban01FechaRegistro: ''
    };

    editingPresupuesto: { [key: string]: boolean } = {};
    editForm: insert_presupuesto = {
        ban01Empresa: '',
        ban01Numero: '',
        ban01Anio: '',
        ban01Mes: '',
        ban01Descripcion: '',
        ban01Fecha: '',
        ban01Estado: '01',
        ban01Usuario: '',
        ban01Pc: '',
        ban01FechaRegistro: ''
    };


    constructor(private gS:GlobalService,private bS: BreadcrumbService, 
        private confirmationService: ConfirmationService,
        private router:Router, 
        private presupuestoService:PresupuestoService,
        private messageService: MessageService, 
        private datePipe: DatePipe) { }

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
        this.router.navigate(['Home/detalle-presupuesto'],navigationExtras)

    }
    /*modificarPago(presupuesto:cabeceraPresupuesto){
        const formattedDate=this.datePipe.transform(presupuesto.fecha,'dd/MM/yyyy');
        const navigationExtras = {
            state: {
                numeropresupuesto: presupuesto.pagoNumero,
                fechapresupuesto: formattedDate,
                isModificacion: true
            }
        };
        this.router.navigate(['/Home/nuevo-presupuesto'], navigationExtras);
    }*/
    iniciarNuevoPresupuesto(){
        this.mostrarNuevaFila=true;
        this.botonesDeshabilitados=true;

        const fechaActual=new Date();
        const fechaRegistroFormateada = this.datePipe.transform(fechaActual, 'dd/MM/yyyy'); //HH:mm:ss.SSS
        this.nuevoPresupuesto={
            ban01Empresa: this.gS.getCodigoEmpresa(),
            ban01Numero: ' ',
            ban01Anio: '',
            ban01Mes: '',
            ban01Descripcion: '',
            ban01Fecha: '',
            ban01Estado: '01',
            ban01Usuario: this.gS.getNombreUsuario(),
            ban01Pc: 'PC',
            ban01FechaRegistro: fechaRegistroFormateada
        }
    }

    cancelarNuevo() {
        this.mostrarNuevaFila = false;
        this.botonesDeshabilitados = false;
        this.nuevoPresupuesto = {
            ban01Empresa: '',
            ban01Numero: '',
            ban01Anio: '',
            ban01Mes: '',
            ban01Descripcion: '',
            ban01Fecha: '',
            ban01Estado: '01',
            ban01Usuario: '',
            ban01Pc: '',
            ban01FechaRegistro: ''
        };
    }
    guardarNuevoPresupuesto() {
        this.presupuestoService.insertarPresupuesto(this.nuevoPresupuesto)
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Presupuesto guardado correctamente'
                    });
                    this.mostrarNuevaFila = false;
                    this.botonesDeshabilitados = false;
                    this.cargarPresupuesto(
                        this.nuevoPresupuesto.ban01Empresa,
                        this.nuevoPresupuesto.ban01Anio,
                        this.nuevoPresupuesto.ban01Mes
                    );
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al guardar el presupuesto: ' + error.message
                    });
                }
            });
    }
    actualizarFecha(event: Date) {
        if (event) {
            this.nuevoPresupuesto.ban01Anio = event.getFullYear().toString();
            this.nuevoPresupuesto.ban01Mes = (event.getMonth() + 1).toString().padStart(2, '0');
            this.nuevoPresupuesto.ban01Fecha = this.datePipe.transform(event, 'dd/MM/yyyy') || '';
        }
    }

    iniciarEdicion(presupuesto: cabeceraPresupuesto) {
        this.editingPresupuesto[presupuesto.pagoNumero] = true;
        const fechaSeleccionada = new Date(presupuesto.fecha);
        this.editForm = {
            ban01Empresa: this.gS.getCodigoEmpresa(),
            ban01Numero: presupuesto.pagoNumero,
            ban01Anio: fechaSeleccionada.getFullYear().toString(),
            ban01Mes: (fechaSeleccionada.getMonth() + 1).toString().padStart(2, '0'),
            ban01Descripcion: presupuesto.motivo,
            ban01Fecha: this.datePipe.transform(fechaSeleccionada, 'dd/MM/yyyy') || '',
            ban01Estado: '01',
            ban01Usuario: this.gS.getNombreUsuario(),
            ban01Pc: 'PC',
            ban01FechaRegistro: this.datePipe.transform(new Date(), 'dd/MM/yyyy') || ''
        };
    }

    cancelarEdicion(pagoNumero: string) {
        delete this.editingPresupuesto[pagoNumero];
    }

    actualizarFechaEdicion(event: Date) {
        if (event) {
            // Actualizar año y mes basado en la fecha seleccionada
            this.editForm.ban01Anio = event.getFullYear().toString();
            this.editForm.ban01Mes = (event.getMonth() + 1).toString().padStart(2, '0');
            this.editForm.ban01Fecha = this.datePipe.transform(event, 'dd/MM/yyyy') || '';
            this.editForm.ban01FechaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';
        }
    }

    guardarEdicion(pagoNumero: string) {
        // Asegurar que la fecha de registro sea la actual al momento de guardar
        this.editForm.ban01FechaRegistro = this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '';

        this.presupuestoService.actualizarPresupuesto(this.editForm).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Presupuesto actualizado correctamente'
                });
                delete this.editingPresupuesto[pagoNumero];
                this.cargarPresupuesto(
                    this.editForm.ban01Empresa,
                    this.editForm.ban01Anio,
                    this.editForm.ban01Mes
                );
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al actualizar el presupuesto: ' + error.message
                });
            }
        });
    }

    eliminarPago(presupuesto: cabeceraPresupuesto) {
        this.confirmationService.confirm({
            message: `
                <div class="text-center">
                    <i class="pi pi-exclamation-circle" style="font-size: 2rem; color: var(--yellow-500); margin-bottom: 1rem; display: block;"></i>
                    <p style="font-size: 1.1rem; margin-bottom: 1rem;">¿Está seguro de eliminar el presupuesto?</p>
                    <p style="color: var(--text-color-secondary);">Número de pago: ${presupuesto.pagoNumero}</p>
                    <p style="color: var(--text-color-secondary);">Fecha: ${this.datePipe.transform(presupuesto.fecha, 'dd/MM/yyyy')}</p>
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
                const numero = presupuesto.pagoNumero;

                this.presupuestoService.eliminarPresupuesto(empresa, numero).subscribe({
                    next: (response) => {
                        if (response.isSuccess) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Presupuesto eliminado correctamente'
                            });
                            // Recargar la lista de presupuestos
                            const fecha = new Date();
                            this.cargarPresupuesto(
                                empresa,
                                fecha.getFullYear().toString(),
                                (fecha.getMonth() + 1).toString().padStart(2, '0')
                            );
                        } else {
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
