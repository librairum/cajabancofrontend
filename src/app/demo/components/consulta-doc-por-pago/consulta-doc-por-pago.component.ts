
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ConsultaDocPorPagoService } from '../../service/consulta-doc-por-pagar.service';
import { ConsultaDocPorPago } from '../../model/ConsultaDocPorPago';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../service/global.service';
import { verMensajeInformativo } from '../utilities/funciones_utilitarias';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-consulta-doc-por-pago',
  standalone: true,
  templateUrl: './consulta-doc-por-pago.component.html',
  styleUrl: './consulta-doc-por-pago.component.css',
  imports: [
    ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, CardModule,
    InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class ConsultaDocPorPagoComponent implements OnInit{
   consultaDocPorPagoForm: FormGroup;
   consultaDocPorPagoList: ConsultaDocPorPago[] = [];
   isEditing: boolean = false;
   items: any[] = [];
   isNew: boolean = false;
 
   constructor(
     private ConsultaDocPorPagoService: ConsultaDocPorPagoService,
     private fb: FormBuilder,
     private breadcrumbService: BreadcrumbService,
     private router: Router,
     private globalService: GlobalService,
     private messageService: MessageService,

   ) {}
 
   ngOnInit(): void {
     this.breadcrumbService.setBreadcrumbs([
       { icon: 'pi pi-home', routerLink: '/Home' },
       { label: 'Consulta doc. por pago', routerLink: '/Home/ConsultaDocPorPago' }
     ]);
     this.breadcrumbService.currentBreadcrumbs$.subscribe(bc => {
       this.items = bc;
     });
     this.initForm();
     this.listarconsultadocporpago();
   }
 
   initForm(): void {
     this.consultaDocPorPagoForm = this.fb.group({
         ban01Empresa: [
             this.globalService.getCodigoEmpresa(),
             Validators.required,
         ],
         ruc	: ['', Validators.required],
         nombreEmpresa: ['', Validators.required],
         tipoDocumento		: ['', Validators.required],
         nroDoc	: ['', Validators.required],
         fechaDocumento	: ['', Validators.required],
         moneda	: ['', Validators.required],
         importeDocumento	: ['', Validators.required],
         importePago	: ['', Validators.required],
         fechaPago: ['', Validators.required],
     });
   }
 
   listarconsultadocporpago(): void {
     const codigoEmpresa:string=this.globalService.getCodigoEmpresa()
     this.ConsultaDocPorPagoService.GetConsultaDocPorPago(codigoEmpresa).subscribe({
       next: (data) => this.consultaDocPorPagoList = data,
       error: () => {
             verMensajeInformativo(this.messageService,'error', 'Error', 'Error al cargar medios de pago');
       }
     });
   }
 }