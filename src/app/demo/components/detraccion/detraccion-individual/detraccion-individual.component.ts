import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { DetraccionService } from '../../../service/detraccion.service';
import { DetraccionIndividual, 
  DetraccionIndividualDocPen, DetraccionIndividualRequest } from 'src/app/demo/model/DetraccionIndividual';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { GlobalService } from '../../../service/global.service';
import {Router} from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { verMensajeInformativo } from '../../utilities/funciones_utilitarias';
import { ConfirmarPagoComponent } from '../../presupuesto/confirmar-pago/confirmar-pago.component';
import { DialogModule } from 'primeng/dialog';
import { insert_presupuesto } from '../../../model/presupuesto';
import { DetraccionIndividualAyudaComponent } from "../detraccion-individual-ayuda/detraccion-individual-ayuda.component";

@Component({
  selector: 'app-detraccion-individual',
  standalone: true,
  imports: [ToastModule, TableModule,
    ReactiveFormsModule, CommonModule, CardModule,
    InputTextModule, PanelModule, BreadcrumbModule,
    ConfirmDialogModule, FormsModule, DropdownModule,
    ButtonModule, CheckboxModule, ConfirmarPagoComponent, DialogModule, DetraccionIndividualAyudaComponent],
  templateUrl: './detraccion-individual.component.html',
  styleUrl: './detraccion-individual.component.css',
  providers:[MessageService,ConfirmationService ]
})
export class DetraccionIndividualComponent implements OnInit {
detraccionIndividualList: DetraccionIndividual[] = [];
rowsPerPage : number = 10;
 confirmarpagocomponente: ConfirmarPagoComponent;
 verConfirmarPago: boolean = false;
 selectedPagoNumero: string = '';
 presupuestoCabDetraccion: insert_presupuesto;
 selectedNumeroLote: string  = '';
 anioPeriodo: string = '';
 mesPeriodo:string = '';
loading: boolean = false;
displayAgregarModal:boolean = false;
//item para breadcrumb
items: any[] = [];


 constructor(private detraccionMasivaService: DetraccionService,
    private bs:BreadcrumbService, 
    private globalService:GlobalService,
    private router:Router, private messageService:MessageService
  )
  {
    
  }
    ngOnInit(): void {
      this.bs.setBreadcrumbs([
          {icon:'pi pi-home', routerLink:'/Home'},
          {label:'Detraccion individual', routerLink:'/Home/detraccion_individual'}
        ]);

        this.bs.currentBreadcrumbs$.subscribe(bs=>{
          this.items = bs;
        })

    this.globalService.selectedDate$.subscribe((date) =>{
        if(date){
          this.anioPeriodo = date.getFullYear().toString();
          this.mesPeriodo = (date.getMonth()+1).toString().padStart(2,'0');
          this.cargar(this.anioPeriodo, this.mesPeriodo);
        }
    });

    }
    cargar(anio:string, mes:string):void{
      this.loading = true;
      const codigoEmpresa: string = this.globalService.getCodigoEmpresa();
    //let anio :string= '';
    //let mes :string = '';
      let motivoPagoCod = '02'
      this.detraccionMasivaService.GetallDetraccionIndividual(codigoEmpresa, 
        anio, mes,motivoPagoCod)
        .subscribe({
          next:(data) =>{
            this.detraccionIndividualList = data;
            this.loading = false;
          }, 
          error:(e) =>{
            this.loading = false;
          }
          
        })
    }
    onCloseModal() {
        if (this.confirmarpagocomponente) {
            this.confirmarpagocomponente.limpiar();
        }
        this.verConfirmarPago = false;
        //this.cargarMedioPago();
        this.globalService.selectedDate$.subscribe((date) => {
            if (date) {
                const year = date.getFullYear().toString();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                this.cargar(this.anioPeriodo, this.mesPeriodo);
            }
        });
    }
     confirmaPagoPresupuesto() : void{
      
      this.verConfirmarPago = true;

     }


}
