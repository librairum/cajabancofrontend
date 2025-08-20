import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DetraccionMasiva} from '../../../model/DetraccionMasiva';
import { DetraccionService } from '../../../service/detraccion.service';
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
@Component({
  selector: 'app-detraccion-masiva',
  standalone: true,
  imports: [ToastModule,TableModule,
    ReactiveFormsModule, CommonModule, CardModule,
    InputTextModule,PanelModule,BreadcrumbModule 
    ,ConfirmDialogModule,FormsModule,DropdownModule
    ,ButtonModule,CheckboxModule, ConfirmarPagoComponent,DialogModule ],
  templateUrl: './detraccion-masiva.component.html',
  styleUrl: './detraccion-masiva.component.css',
  providers:[MessageService, ConfirmationService]
})
export class DetraccionMasivaComponent implements OnInit {
detraccionMasivaList: DetraccionMasiva[] = [];
rowsPerPage : number = 10;
 confirmarpagocomponente: ConfirmarPagoComponent;
 verConfirmarPago: boolean = false;
 selectedPagoNumero: string = '';
 presupuestoCabDetraccion: insert_presupuesto;
 selectedNumeroLote: string  = '';
 anioPeriodo: string = '';
 mesPeriodo:string = '';
loading: boolean = false;
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
      {label:'Detraccion masiva', routerLink:'/Home/detraccionmasiva'}
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
    
    this.cargar(this.anioPeriodo, this.mesPeriodo);

  }

  cargar(anio, mes):void{
    this.loading = true;
    const codigoEmpresa: string = this.globalService.getCodigoEmpresa();
    //let anio :string= '';
    //let mes :string = '';
    let motivoPagoCod = '03'
    // this.globalService.selectedDate$.subscribe((date)=>{
    //   anio = date.getFullYear().toString();
    //   mes = (date.getMonth()+1).toString().padStart(2,'0');
      
    // });
    this.detraccionMasivaService.GetAllDetraccion(codigoEmpresa,anio, mes,motivoPagoCod)
    .subscribe({
      next:(data) =>{
        this.detraccionMasivaList = data;
      this.loading = false;
        //console.log("informacion de data:",data);
        //console.log("DetraccionMasviLIst:", this.detraccionMasivaList);
      },
      error:(e) => {
         this.loading = false;
       verMensajeInformativo(
                              this.messageService,
                              'error',
                              'Error',
                              'Error al cargar documentos por pago'
                          );
      }
    });

  }

  verDetalle(detra: DetraccionMasiva ):void{

    

    if(detra.presupuestoCod.length > 0 ){
      console.log("abrir pagina detraccion masiva  det");
      
      console.log(detra);
      const navigationExtras = {
        state:{
                         
          nroLote: detra.loteDetraccionNro,
          presupuestoCod: detra.presupuestoCod,
          anio:detra.anio,
          mes:detra.mes,
          empresa:detra.empresaCod,
          pagnro:detra.presupuestoCod,
          fecha:detra.fecha,
          nombreMedioPago:  detra.nombreMedioPago,
          motivo:detra.motivo
          
        }
      }
      console.log("Datos de navigation desde detraccion masiva", navigationExtras);
      
    this.router.navigate(['Home/detraccion_masiva_presupuesto_det'],navigationExtras );
    } else{
      
      console.log("abrir pagina detraccion masiva presupuesto det");
      //abrir detracccion
      let navigationExtras={
        state:{
          nroLote:detra.loteDetraccionNro,
          empresa:detra.empresaCod,
          pagnro:detra.presupuestoCod,
          fecha:detra.fecha,
          nombreMedioPago:  detra.nombreMedioPago,
          motivo:detra.motivo
          
        }
        
      }
      this.router.navigate(['Home/detraccion_masiva_det'],navigationExtras);  
      
    }
  }

  eliminarPagoPresupuesto():void{
    
  }

  confirmarPagoPresupuesto(registro:DetraccionMasiva):void{
    this.selectedPagoNumero = '0001';

    this.verConfirmarPago=true;
    
    this.selectedNumeroLote = registro.loteDetraccionNro;
    console.log("numero detraccion seleccioando");
    console.log(this.selectedNumeroLote)
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

}
