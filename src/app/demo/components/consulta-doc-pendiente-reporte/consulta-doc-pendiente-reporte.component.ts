
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
import { PresupuestoService } from '../../service/presupuesto.service';
import { HttpResponse } from '@angular/common/http';
import { Detallepresupuesto,agregar_Pago } from '../../model/presupuesto';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {formatDateForFilename} from 'src/app/demo/components/utilities/funciones_utilitarias'; 
@Component({
  selector: 'app-consulta-doc-pendiente-reporte',
  standalone: true,
  imports: [ToastModule,
        TableModule,
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        PanelModule,
        BreadcrumbModule,
        ConfirmDialogModule,
        FormsModule
      ],
  providers:[MessageService],
  templateUrl: './consulta-doc-pendiente-reporte.component.html',
  styleUrl: './consulta-doc-pendiente-reporte.component.css'
})
export class ConsultaDocPendienteReporteComponent implements OnInit {

items: any[] = [];
textoBuscar: string='';
consultaDocPorPagoList: ConsultaDocPorPago[] = [];
ayudapago: agregar_Pago[] = [];
  constructor(private presupuestoService:PresupuestoService, 
    private breadcrumbService:BreadcrumbService,
   private globalService: GlobalService,
  private messageService:MessageService ){}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            {
                label: 'Consulta doc. por pago',
                routerLink: '/Home/ConsultaDocPendienteReporte',
            },
        ]);
        this.breadcrumbService.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });
        this.initForm();
        (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

  }
 initForm(): void {}

buscar():void{}


 listarconsultadocporpago(): void {
        let filtro = this.textoBuscar.trim();

        if(filtro === ''){
            // No cargar nada si el filtro está vacío
            this.consultaDocPorPagoList = [];
            return;
        }
        this.presupuestoService.obtenerDocPendienteReporte(this.globalService.getCodigoEmpresa(),
        filtro )
            .subscribe({
              next:(data) =>{
                this.ayudapago = data;
              }
            ,
            error:()=>{
              verMensajeInformativo(this.messageService, 
                'error',
                'error', 'error al cargar documentos por pago');

            }
          });
        
        // this.presupuestoService.obtenerDocPendienteReporte(this.globalService.getCodigoEmpresa(), filtro,)                    
        //     .subscribe({
        //         next: (data) => {
        //             this.ayudapago = data;
        //         },
        //         error: () => {
        //             verMensajeInformativo(
        //                 this.messageService,
        //                 'error',
        //                 'Error',
        //                 'Error al cargar documentos por pago'
        //             );
        //         },
        //     });
    }


 generarPDFPendiente(dataReporte: agregar_Pago[]):void{

        //this.obtenerFacturaPendiente();


        
          if (!dataReporte || dataReporte.length === 0) {
            // verMensajeInformativo(this.messageService,'warn', 'Advertencia', 'No hay datos para exportar');
            console.log("No retoarn datoa de ayuda pago");
            return;
        }
        console.log("metodo generar pdf pendiente:");
        
        console.log("metod generar pdf");
        var resultados  =dataReporte;
        console.log("datos generaro en generar pdf:"+resultados);
         //this.presupuestoService.console.lo
        /*
        
        Ruc
razonSocial
CodigoTipoDoc
NombreTipoDoc
NumeroDocumento
FechaEmision
FechaVencimiento
MonedaOriginal
Soles
Dolares
AfectaDetraccion
AfectaRetencion
        */
        // Definimos las cabeceras
        const headers = [
            [
                
                { text: 'RUC', rowSpan: 2, style: 'tableHeader' },//1
                { text: 'Razon Social', rowSpan: 2, style: 'tableHeader' },//2
                { text: 'Tipo Doc', rowSpan: 2, style: 'tableHeader' }, //3
                { text: 'Numero', rowSpan: 2, style: 'tableHeader' },       //4          
                { text: 'Fecha emision', rowSpan: 2, style: 'tableHeader' }, //5
                { text: 'Fecha vencimiento', rowSpan: 2, style: 'tableHeader' }, //6
                { text: 'Moneda Original', rowSpan: 2, style: 'tableHeader' }, //7
                { text: 'Importe Total S/.', rowSpan: 2, style: 'tableHeader' },//8
                { text: 'Importe Total US$', rowSpan: 2, style: 'tableHeader' },//9
                
                { text: 'Detraccion', rowSpan:2, style: 'tableHeader' }, //10     
                { text: 'Retencion', rowSpan: 2, style: 'tableHeader' },//11
                
            ],
                      
        ];
         console.log("metod generar cabececera");
        // Agrupamos por RUC
        const groupedData = {};
        this.ayudapago.forEach((item) => {
            if (!groupedData[item.ruc]) {
                groupedData[item.ruc] = [];
            }
            groupedData[item.ruc].push(item);
        });

        console.log("metod agrupar datos ");
        // Formato para los numeros
        const formatNumber = (num) => {
            const numero = Number(num);
            if (isNaN(numero)) return '0.00';

            return numero.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        };

        const formatCell = (value: any) => ({
            text: formatNumber(value),
            alignment: 'right'
        });



        
        // Cuerpo de la tabla
        const body = [...headers];

        Object.keys(groupedData).forEach((ruc) => {
             const groupItems = groupedData[ruc];

            groupItems.forEach((item) => {
                body.push([
                    item.ruc,        //1            
                    item.razonSocial, //2
                    item.nombreTipoDOc, //3
                    item.numeroDOcumento, //4
                    item.fechaEmision, //5
                    item.fechaVencimiento, //6
                    item.monedaOriginal, //7
                    formatCell(item.soles), //8
                    formatCell(item.dolares),   //9                  
                    item.afectoDetraccion || '', //10
                    item.afectoRetencion || '' //11
                    
                ]);
            });

        });
        console.log("se crero el reporte, falta mostrar");
        const docDefinition = {
                    pageOrientation: 'landscape',
                    pageMargins: [20, 20, 20, 20],
                    content: [
                        //title
                        { text: 'Detalle de Presupuesto', style: 'header' },
                        //description
                        {
                            columns: [
                                {
                                    width: 'auto',
                                    text: [
                                        { text: 'Numero de Pago: ', style: 'label' },
                                        //{ text: this.pagnro, style: 'value' },
                                        { text:'001', style: 'value' },
                                    ],
                                },
                                {
                                    width: 'auto',
                                    text: [
                                        { text: 'Fecha: ', style: 'label' },
                                        // { text: this.fechaString, style: 'value' },
                                        { text:'15/07/2025', style: 'value' },
                                    ],
                                    margin: [20, 0, 0, 0],
                                },
                                {
                                    width: 'auto',
                                    text: [
                                        { text: 'Motivo: ', style: 'label' },
                                        //{ text: this.motivo, style: 'value' },
                                        { text: 'motivo', style: 'value' },
                                    ],
                                    margin: [20, 0, 0, 0],
                                },
                                {
                                    width: 'auto',
                                    text: [
                                        { text: 'Medio Pago: ', style: 'label' },
                                        //{ text: this.medio, style: 'value' },
                                        { text: 'medio pago', style: 'value' },
                                    ],
                                    margin: [20, 0, 0, 0],
                                },
                            ],
                            margin: [0, 0, 0, 10],
                        },
                        //table
                        {
                            table: {
                                headerRows: 2,
                                widths: [
                                    40, //1 // ruc
                                    150,  //2  razon social
                                    30,  //3 tipo documento
                                    28,  //4 numero del documento  factura
                                    40, //5 fecha emision 
                                    40,  //6 fecha vencimiento 
                                    33, //7 moneda original
                                    60, //8 importe total S/
                                    60, //9 importe total $
                                    40, //10 detraccion 
                                    40 //11 retencion
                                    
                                ],
                                body: body,
                                alignment: 'center',
                            },
                            layout: {
                                hLineWidth: function (i, node) {
                                    return i === 0 ||
                                        i === 1 ||
                                        i === 2 ||
                                        i === node.table.body.length
                                        ? 1
                                        : 0.5;
                                },
                                vLineWidth: function (i, node) {
                                    return 0.5;
                                },
                                hLineColor: function (i, node) {
                                    return i === 0 ||
                                        i === 1 ||
                                        i === 2 ||
                                        i === node.table.body.length
                                        ? 'black'
                                        : '#aaa';
                                },
                                vLineColor: function (i, node) {
                                    return '#aaa';
                                },
                                paddingTop: function (i) {
                                    return 4;
                                },
                                paddingBottom: function (i) {
                                    return 4;
                                },
                            },
                        },
                    ],
                    styles: {
                        header: {
                            fontSize: 15,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 0, 0, 11],
                        },
                        label: {
                            bold: true,
                            fontSize: 8,
                        },
                        value: {
                            fontSize: 8,
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 7,
                            alignment: 'center',
                            fillColor: '#eeeeee',
                            margin: [0, 5],
                        },
                        subtotal: {
                            bold: true,
                            fontSize: 6,
                            alignment: 'right',
                        },
                        total: {
                            bold: true,
                            fontSize: 6,
                            alignment: 'right',
                        },
                    },
                    defaultStyle: {
                        fontSize: 6,
                        alignment: 'left',
                    },
                };
        
                // Generamos el pdf
                //pdfMake.createPdf(docDefinition).download('DetallePrespupuesto_' + this.pagnro + '.pdf');
                const fileName = 'DetallePrespuesto_' + '00001' +formatDateForFilename(new Date())+  '.pdf';
                // const fileName = 'DetallePrespupuesto_' +
                //     this.pagnro +
                //     '_' +
                //     formatDateWithTime((this.fechahoy = new Date())) +
                //     '.pdf';
        
                pdfMake.createPdf(docDefinition).open({
                    filename: fileName
                });

    }  

}





