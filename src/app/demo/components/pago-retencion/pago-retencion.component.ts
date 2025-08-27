import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DetraccionMasiva} from '../../model/DetraccionMasiva';
import { DetraccionService } from '../../service/detraccion.service';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { GlobalService } from '../../service/global.service';
import {Router} from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { verMensajeInformativo } from '../utilities/funciones_utilitarias';
import { ConfirmarPagoComponent } from '../presupuesto/confirmar-pago/confirmar-pago.component';
import { DialogModule } from 'primeng/dialog';
import { insert_presupuesto } from '../../model/presupuesto';
import { PagoRetencion } from '../../model/Pago_Retencion';

@Component({
  selector: 'app-pago-retencion',
  standalone: true,
  imports: [ToastModule,TableModule,
      ReactiveFormsModule, CommonModule, CardModule,
      InputTextModule,PanelModule,BreadcrumbModule
      ,ConfirmDialogModule,FormsModule,DropdownModule
      ,ButtonModule,CheckboxModule, ConfirmarPagoComponent,DialogModule ],
  templateUrl: './pago-retencion.component.html',
  styleUrl: './pago-retencion.component.css',
  providers: [MessageService, ConfirmationService]

})
export class PagoRetencionComponent {
    //item para breadcrumb
    items: any[] = [];

    rowsPerPage : number = 10;
    loading: boolean = false;

    verConfirmarPago: boolean = false;
    confirmarpagocomponente: ConfirmarPagoComponent;
    selectedPagoNumero: string = '';
    selectedNumeroOperacion: string  = '';

    anioPeriodo: string = '';
    mesPeriodo:string = '';


    pagoRetencionList: PagoRetencion[] = [
        {
            pagoNro: '01',
            fecha: '21/01/2025',
            motivo: 'Servicios profesionales',
            medioPago: 'Transferencia',
            importeFactura: 150000.55,
            importeRetencion: 2250.55,
            operacionNro: '1001'
        },
        {
            pagoNro: '02',
            fecha: '22/02/2025',
            motivo: 'Compra de materiales',
            medioPago: 'Cheque',
            importeFactura: 200000.55,
            importeRetencion: 3000.55,
            operacionNro: '1002'
        },
        {
            pagoNro: '03',
            fecha: '23/03/2025',
            motivo: 'Consultoría',
            medioPago: '', // Agregar campo vacío
            importeFactura: 120000.55,
            importeRetencion: 1800.55,
            operacionNro: '' // Agregar campo vacío
        },
        {
            pagoNro: '04',
            fecha: '24/04/2025',
            motivo: 'Mantenimiento',
            medioPago: '', // Agregar campo vacío
            importeFactura: 180000.55,
            importeRetencion: 2700.55,
            operacionNro: '' // Agregar campo vacío
        }
    ];

    constructor(
        private bs: BreadcrumbService,
        private globalService: GlobalService,
        private router: Router,
        private messageService: MessageService
    ){

    }

    ngOnInit(){
        //Breadcrumb
        this.bs.setBreadcrumbs([
        {icon:'pi pi-home', routerLink:'/Home'},
        {label:'Pago retencion', routerLink:'/Home/pago_retencion'}
        ]);

        this.bs.currentBreadcrumbs$.subscribe(bs=>{
        this.items = bs;
        })

        this.globalService.selectedDate$.subscribe((date) =>{
        if(date){
          this.anioPeriodo = date.getFullYear().toString();
          this.mesPeriodo = (date.getMonth()+1).toString().padStart(2,'0');

        }
    })
    }

    verDetalle(pago: PagoRetencion):void {
        console.log("boton ver detalle seleccionado");
    }

    confirmarPagoPresupuesto(registro:PagoRetencion):void{
        console.log("boton pagar seleccionado");
        this.selectedPagoNumero = '0001';

        this.verConfirmarPago=true;

        this.selectedNumeroOperacion = registro.operacionNro;
        console.log("numero operacion seleccioando");
        console.log(this.selectedNumeroOperacion)
  }


    onCloseModal(){
        if (this.confirmarpagocomponente) {
            this.confirmarpagocomponente.limpiar();
        }
        this.verConfirmarPago = false;
        //this.cargarMedioPago();
        this.globalService.selectedDate$.subscribe((date) => {
            if (date) {
                const year = date.getFullYear().toString();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                //this.cargar(this.anioPeriodo, this.mesPeriodo);
            }
        });
    }


    //Función para formatear los numeros mayores a 1000
    formatNumber(value: number): string {
        if (value === null || value === undefined) {
            return '';
        }

        return value.toLocaleString('en-US');
    }
}
