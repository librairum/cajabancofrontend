import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { GlobalService } from 'src/app/demo/service/global.service';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import {agregar_Pago, insert_detalle, proveedores_lista,} from '../../../model/presupuesto';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { calendario_traduccion } from 'src/app/shared/Calendarios';
import { InputTextModule } from 'primeng/inputtext';
import { verMensajeInformativo } from 'src/app/demo/components/utilities/funciones_utilitarias';
import { ConfigService } from 'src/app/demo/service/config.service';
import { ConfirmarPagoComponent } from '../../presupuesto/confirmar-pago/confirmar-pago.component';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-detraccion-individual-ayuda',
  standalone: true,
  imports: [  FormsModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        ToastModule,
        PanelModule,
        ConfirmDialogModule,
        TableModule,
        CommonModule,
        ButtonModule,
        RouterModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,ConfirmarPagoComponent , DialogModule],
  templateUrl: './detraccion-individual-ayuda.component.html',
  styleUrl: './detraccion-individual-ayuda.component.css',
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class DetraccionIndividualAyudaComponent implements OnInit {

  loading: boolean = false;
  proveedores: proveedores_lista[] =[];
selectedItems:agregar_Pago[] = [];
ayudapago: agregar_Pago[] = [];
selectedPagoNumero: string = '';
selectedNumeroLote:string = '';
verConfirmarPago: boolean = false;

//cargar datos en dura:
  cargarDatosTablas(){
    let registro1  : agregar_Pago ={
      clave:'xxx',
      ruc:'20555841095',
      razonSocial:'gm ingenieros y consultores',
      coditoTipoDoc:'',
      nombreTipoDOc:'',
      numeroDOcumento:'',
      monedaOriginal:'',
      soles:0,
      dolares:0,
      fechaEmision:'',
      fechaVencimiento:'',
      diasAtrazo:0,
      afectoDetraccion:'S',
      afectoRetencion:'N'

    }
    this.ayudapago.push(registro1);
  }
  onProveedorChallenge(event:any){

  }
  filtrar(){

  }
  onAddSelected(){

  }
  onCancelSelection():void{

  }

  ngOnInit(): void {
      this.cargarDatosTablas();
  }
  confirmarPagoPresupuesto(registro: agregar_Pago):void{

  }

onCloseModal() {
        // if (this.confirmarpagocomponente) {
        //     this.confirmarpagocomponente.limpiar();
        // }
        this.verConfirmarPago = false;
        // this.displayAgregarModal = false;
        //this.cargarMedioPago();
        // this.globalService.selectedDate$.subscribe((date) => {
        //     if (date) {
        //         const year = date.getFullYear().toString();
        //         const month = (date.getMonth() + 1).toString().padStart(2, '0');
        //         this.cargar(this.anioPeriodo, this.mesPeriodo);
        //     }
        // });
    }

  
}
