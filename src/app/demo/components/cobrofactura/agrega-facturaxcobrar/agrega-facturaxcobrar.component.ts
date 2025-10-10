
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { GlobalService } from 'src/app/demo/service/global.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { verMensajeInformativo } from 'src/app/demo/components/utilities/funciones_utilitarias';
import { ConfigService } from 'src/app/demo/service/config.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FacturaPorCobrar } from 'src/app/demo/model/CuentaxCobrar';
import { CobroFacturaService } from 'src/app/demo/service/cobrofactura.service';
@Component({
  selector: 'app-agrega-facturaxcobrar',
  standalone: true,
  imports: [ FormsModule,
          ReactiveFormsModule,          
          ToastModule,
          PanelModule,          
          TableModule,
          CommonModule,
          ButtonModule,
          RouterModule,          
          InputTextModule,ConfirmDialogModule,  ],
  templateUrl: './agrega-facturaxcobrar.component.html',
  styleUrl: './agrega-facturaxcobrar.component.css'
})
export class AgregaFacturaxcobrarComponent implements OnInit {
filtroFRM: FormGroup;
items: any[] = [];
loading: boolean = false;
listaFacturas : FacturaPorCobrar[] = [];
anio:string = '2025';
mes: string = '01';
selectedItems : any[] = [];
 datosRegistrosCab : any;
@Input() codigoCliente : string;
@Input() nombreCliente:string;
constructor(
        private link: Router,
        private primeng: PrimeNGConfig,
        private fb: FormBuilder,
        private globalService: GlobalService,        
        private confirmationService: ConfirmationService,
        private router: Router,        
        private messageService: MessageService,
        private datePipe: DatePipe,
        private configService: ConfigService,
        private cobroService: CobroFacturaService
    ) {
        const navigation = this.router.getCurrentNavigation();
        
        if (navigation?.extras.state) {
            //const state = navigation.extras.state as any;
            this.datosRegistrosCab =  navigation.extras.state as any;
            //this.numeropresupuestoMod = state.pagonro;
            //this.fechapresupuestoMod = state.fechaformateada;
          

        } else {
            this.router.navigate(['Home/detalle-presupuesto']);
        }

        this.filtroFRM = fb.group({
            empresa: ['', [Validators.required]],
            ruc: ['', [Validators.required]],
            nrodoc: ['', [Validators.required]],
        });
    }

    onAddSelected(){
        if (this.selectedItems.length === 0) {
                    verMensajeInformativo(this.messageService,'warn', 'Advertencia', 'Seleccione al menos un registro');
                    return;
                }
        
                const xmlDoc = document.implementation.createDocument(
                    null,
                    'DataSet',
                    null
                );
        
                this.selectedItems.forEach((item) => {
                    const tblElement = xmlDoc.createElement('tbl');
        
                    const fields = {
                        ruc: item.clienteCodigo,
                        
                        codigoTipDoc: item.codigoTipoDocumento,                        
                        numeroDocumento: item.numeroDocumento,                        
                        soles: item.totalSoles.toString(),
                        dolares: item.totalDolares.toString(),                        
                        
                    };
        
                    for (const [key, value] of Object.entries(fields)) {
                        const element = xmlDoc.createElement(key);
                        element.textContent = value;
                        tblElement.appendChild(element);
                    }
        
                    xmlDoc.documentElement.appendChild(tblElement);
                });
        
                const xmlString = new XMLSerializer().serializeToString(xmlDoc);
                console.log("dato de xml");
                 console.log(xmlString);
                // console.log('--- component agregar pago typscript');
                // console.log(this.numeropresupuestoMod);
                // console.log(this.fechapresupuestoMod);
                // console.log('--- end component agregar pago typscript');

                // const detallePresupuesto: insert_detalle = {
                //     empresa: this.globalService.getCodigoEmpresa(),
                //     numeropresupuesto: this.numeropresupuestoMod || '', // Si es null, enviar string vacío
                //     tipoaplicacion: this.configService.getTipoAplicacion(),
                //     fechapresupuesto: this.fechapresupuestoMod || '', // Si es null, enviar string vacío
                //     bcoliquidacion: '00',
                //     xmlDetalle: xmlString,
                // };
        
                // this.presupuestoService
                //     .insertarDetallePresupuesto(detallePresupuesto)
                //     .subscribe({
                //         next: (response) => {
                //             verMensajeInformativo(this.messageService,'success', 'Éxito', 'Detalle insertado correctamente');
                //             this.selectedItems = [];
                //             this.ayudapago = [];
                //             this.onClose.emit();
                //         },
                //         error: (error) => {
                //             verMensajeInformativo(this.messageService,'error', 'Error', `Error al insertar el detalle: ${error.message}`);
                //         },
                //     });
    }

    cargarAyudaFacturas(){
    let codempresa =  this.globalService.getCodigoEmpresa();
    //   let codigoCliente:string = '';
      
      this.cobroService.getListaAyudaFacturaPorCobrar(codempresa, 
         'sara', this.codigoCliente )
      .subscribe({
        next:(data) =>{
            console.log("data de factura pendiente por cobrar: ",data);
            this.listaFacturas = data;
            
            this.loading = false;
        }, error:(error) =>{
            this.loading = false;
                verMensajeInformativo(
                    this.messageService,
                    'error',
                    'Error',
                    `Error al cargar factura por cobrar: ${error.message}`
                );
        }
      });
    }
    ngOnInit(): void {
      this.filtroFRM.reset();
      this.cargarAyudaFacturas();
    }
    onCancelSelection() {
        this.selectedItems = [];
    }

}
