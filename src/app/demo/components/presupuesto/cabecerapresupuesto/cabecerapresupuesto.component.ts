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
    modificarPago(presupuesto:cabeceraPresupuesto){
        const formattedDate=this.datePipe.transform(presupuesto.fecha,'dd/MM/yyyy');
        const navigationExtras = {
            state: {
                numeropresupuesto: presupuesto.pagoNumero,
                fechapresupuesto: formattedDate,
                isModificacion: true
            }
        };
        this.router.navigate(['/Home/nuevo-presupuesto'], navigationExtras);
    }
    iniciarNuevoPresupuesto(){
        this.mostrarNuevaFila=true;
        this.botonesDeshabilitados=true;

        const fechaActual=new Date();
        const fechaRegistroFormateada = this.datePipe.transform(fechaActual, 'yyyy-MM-dd'); //HH:mm:ss.SSS
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

}
