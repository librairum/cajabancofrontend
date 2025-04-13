import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { cabeceraPresupuesto, insert_presupuesto, mediopago_lista } from '../presupuesto';
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
import { ConfirmarPagoComponent } from '../confirmar-pago/confirmar-pago.component';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
@Component({
    selector: 'app-cabecerapresupuesto',
    standalone: true,
    imports: [BreadcrumbModule, ToastModule, PanelModule,
        ConfirmDialogModule, TableModule, CommonModule, ButtonModule,
        RouterModule, FormsModule, CalendarModule, InputTextModule,
        InputNumberModule, DropdownModule, ReactiveFormsModule,
        ConfirmarPagoComponent, DialogModule, FileUploadModule],
    templateUrl: './cabecerapresupuesto.component.html',
    styleUrl: './cabecerapresupuesto.component.css',
    providers: [ConfirmationService, MessageService, DatePipe]
})
export class CabecerapresupuestoComponent implements OnInit {
    @ViewChild(ConfirmarPagoComponent) confirmarpagocomponente: ConfirmarPagoComponent;
    //breadcrumb
    items: any[] = []
    prueba!: any[];
    presupuesto: cabeceraPresupuesto[] = []
    loading: boolean = false;
    mostrarNuevaFila: boolean = false;
    botonesDeshabilitados: boolean = false;
    medioPagoLista: mediopago_lista[] = [];
    selectMedioPago: string | null = null;
    verConfirmarPago: boolean = false;
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
        ban01FechaRegistro: '',
        ban01mediopago: '',
        NombreMedioPago: ''
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
        ban01FechaRegistro: '',
        ban01mediopago: '',
        NombreMedioPago: ''
    };
    //para pasar el pagonro
    selectedPagoNumero: string = '';

    constructor(private gS: GlobalService, private bS: BreadcrumbService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private presupuestoService: PresupuestoService,
        private messageService: MessageService,
        private datePipe: DatePipe) { }


    cargarMedioPago(): void {
        const codempresa: string = this.gS.getCodigoEmpresa();
        this.loading = true;
        this.presupuestoService.obtenerMedioPago(codempresa).subscribe({
            next: (data) => {
                console.log(data);
                this.medioPagoLista = data;
                console.log(this.medioPagoLista);
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

    onMedioChange(event: any) {
        this.selectMedioPago = event.value;

    }

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
        this.cargarMedioPago();
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
    verDetalles(presupuesto: cabeceraPresupuesto) {

        const formattedDate = this.datePipe.transform(presupuesto.fecha, 'dd/MM/yyyy');

        const navigationExtras = {
            state: {
                PagoNro: presupuesto.pagoNumero,
                Fecha: formattedDate,
                motivo: presupuesto.motivo,
                nombreMedioPago: presupuesto.nombreMedioPago,
            }
        }
        this.router.navigate(['Home/detalle-presupuesto'], navigationExtras)
    }
    verVouchercontable(presupuesto: cabeceraPresupuesto) {

        const navigationExtras = {
            state: {
                empresa: this.gS.getCodigoEmpresa(),
                PagoNro: presupuesto.pagoNumero,
            }
        }
        this.router.navigate(['Home/voucher_contable'], navigationExtras)
    }
    iniciarNuevoPresupuesto() {
        this.mostrarNuevaFila = true;
        this.botonesDeshabilitados = true;

        const fechaActual = new Date();
        const fechaRegistroFormateada = this.datePipe.transform(fechaActual, 'dd/MM/yyyy'); //HH:mm:ss.SSS
        const anioActual = fechaActual.getFullYear().toString();
        const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, '0');

        this.nuevoPresupuesto = {
            ban01Empresa: this.gS.getCodigoEmpresa(),
            ban01Numero: ' ',
            ban01Anio: anioActual,  // Set year from current date
            ban01Mes: mesActual,    // Set month from current date
            ban01Descripcion: '',
            ban01Fecha: fechaRegistroFormateada,
            ban01Estado: '01',
            ban01Usuario: this.gS.getNombreUsuario(),
            ban01Pc: 'PC',
            ban01FechaRegistro: fechaRegistroFormateada,
            ban01mediopago: '',
            NombreMedioPago: ''
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
            ban01FechaRegistro: '',
            ban01mediopago: '',
            NombreMedioPago: ''
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

                    const nuevoPagoNumero = response.item;
                    if (nuevoPagoNumero) {
                        const formattedDate = this.datePipe.transform(this.nuevoPresupuesto.ban01Fecha, 'dd/MM/yyyy');
                        let nombreMedioPago = '';
                        if (this.nuevoPresupuesto.ban01mediopago) {
                            const medioPago = this.medioPagoLista.find(mp => mp.ban01IdTipoPago === this.nuevoPresupuesto.ban01mediopago);
                            if (medioPago) {
                                nombreMedioPago = medioPago.ban01Descripcion;
                            }
                        }
                        const navigationExtras = {
                            state: {
                                PagoNro: nuevoPagoNumero,
                                Fecha: formattedDate,
                                motivo: this.nuevoPresupuesto.ban01Descripcion,
                                nombreMedioPago: nombreMedioPago,
                            }
                        };
                        this.router.navigate(['Home/detalle-presupuesto'], navigationExtras);
                    }
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
        const foundMedioPago = this.medioPagoLista.find(
            mp => mp.ban01Descripcion === presupuesto.nombreMedioPago
        );
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
            ban01FechaRegistro: this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '',
            ban01mediopago: foundMedioPago ? foundMedioPago.ban01IdTipoPago : '',
            NombreMedioPago: '',
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
                <p style="text-align: center;">
                    ¿Está seguro de eliminar el presupuesto?
                </p>
                <div style="text-align: center; margin-top: 10px;">
                    <p>
                        <strong>Número de pago: </strong>${
                            presupuesto.pagoNumero
                        }
                    </p>
                    <p>
                        <strong>Fecha:</strong> ${this.datePipe.transform(
                            presupuesto.fecha,
                            'dd/MM/yyyy'
                        )}
                    </p>
                </div>
            `,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                const empresa = this.gS.getCodigoEmpresa();
                const numero = presupuesto.pagoNumero;

                this.presupuestoService
                    .eliminarPresupuesto(empresa, numero)
                    .subscribe({
                        next: (response) => {
                            if (response.isSuccess) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Presupuesto eliminado correctamente',
                                });
                                // Recargar la lista de presupuestos
                                const fecha = new Date();
                                this.cargarPresupuesto(
                                    empresa,
                                    fecha.getFullYear().toString(),
                                    (fecha.getMonth() + 1)
                                        .toString()
                                        .padStart(2, '0')
                                );
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail:
                                        response.message ||
                                        'Error al eliminar el presupuesto',
                                });
                            }
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail:
                                    'Error al eliminar el presupuesto: ' +
                                    error.message,
                            });
                        },
                    });
            },
        });
    }
    confirmarPago(presupuesto: cabeceraPresupuesto) {
        this.selectedPagoNumero = presupuesto.pagoNumero;
        console.log(this.selectedPagoNumero)
        this.verConfirmarPago = true;
    }
    onCloseModal() {
        if (this.confirmarpagocomponente) {
            this.confirmarpagocomponente.limpiar();
        }
        this.verConfirmarPago = false;
        this.cargarMedioPago();
        this.gS.selectedDate$.subscribe(date => {
            if (date) {
                const year = date.getFullYear().toString();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                this.cargarPresupuesto(this.gS.getCodigoEmpresa(), year, month);
            }
        });
    }
    uploadFunction() { }
    abrirdocumento(filePath: string): void {
        if (filePath) {
            // Solo abre una nueva ventana y coloca la ruta directamente en la barra de direcciones
            window.open(filePath, '_blank');
        }
    }

    anio_dato: string = ""
    mes_dato: string = ""

    anularPago(presupuesto: cabeceraPresupuesto) {
        this.confirmationService.confirm({
            message: `
                <p style="text-align: center;">
                    ¿Está seguro de anular?
                </p>
                <div style="text-align: center; margin-top: 10px;">
                    <p>
                        <strong>Número de pago: </strong>${
                            presupuesto.pagoNumero
                        }
                    </p>
                </div>
            `,
            header: 'Anular comprobante de pago',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-danger ',
            rejectButtonStyleClass: 'p-button',
            accept: () => {
                this.gS.selectedDate$.subscribe((date) => {
                    if (date) {
                        this.anio_dato = date.getFullYear().toString();
                        this.mes_dato = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, '0');
                    }
                });
                const parametrosanulacion = {
                    empresa: this.gS.getCodigoEmpresa(),
                    anio: this.anio_dato,
                    mes: this.mes_dato,
                    numeropresupuesto: presupuesto.pagoNumero,
                    flagOperacion: 'E',
                    fechapago: '',
                    numerooperacion: '',
                    enlacepago: presupuesto.ban01EnlacePago,
                };
                this.presupuestoService
                    .actualizarComprobante(parametrosanulacion)
                    .subscribe({
                        next: (response) => {
                            if (response.isSuccess) {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Pago anulado correctamente',
                                });
                                this.gS.selectedDate$.subscribe((date) => {
                                    if (date) {
                                        const year = date
                                            .getFullYear()
                                            .toString();
                                        const month = (date.getMonth() + 1)
                                            .toString()
                                            .padStart(2, '0');
                                        this.cargarPresupuesto(
                                            this.gS.getCodigoEmpresa(),
                                            year,
                                            month
                                        );
                                    }
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail:
                                        response.message ||
                                        'Error al anular el pago',
                                });
                            }
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail:
                                    'Error al anular el pago: ' + error.message,
                            });
                        },
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'Anulación de pago cancelada',
                });
            },
        });



    }


}
