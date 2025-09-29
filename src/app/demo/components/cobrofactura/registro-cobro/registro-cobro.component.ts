import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { GlobalService } from 'src/app/demo/service/global.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroCobro } from 'src/app/demo/model/CuentaxCobrar';
import { mediopago_lista } from 'src/app/demo/model/presupuesto';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { ConfigService } from 'src/app/demo/service/config.service';
import { CobroFacturaService } from 'src/app/demo/service/cobrofactura.service';
import { verMensajeInformativo } from '../../utilities/funciones_utilitarias';
import { TraeRegistroCobro } from 'src/app/demo/model/CuentaxCobrar';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-registro-cobro',
  standalone: true,
  imports: [ConfirmDialogModule, ToastModule,
    CalendarModule,InputTextModule, DropdownModule,
  TableModule, FormsModule, ReactiveFormsModule,
  RouterModule,BreadcrumbModule,PanelModule, NgIf],
  templateUrl: './registro-cobro.component.html',
  styleUrl: './registro-cobro.component.css',
  providers:[ConfirmationService, MessageService, DatePipe]
})
export class RegistroCobroComponent implements OnInit{

  items: any[] = [];
    prueba!: any[];
    anioFecha: string = '';
    mesFecha: string = '';
    listaRegistroCobro: TraeRegistroCobro[] = [];
    loading: boolean = false;
    mostrarNuevaFila: boolean = false;
    botonesDeshabilitados: boolean = false;
   medioPagoLista: mediopago_lista[] = [];
   selectMedioPago: string | null = null;
   rowsPerPage: number = 10; // Numero de filas por página
   monedaOpciones : any[] = [];


 nuevoFormulario: RegistroCobro ={
    ban03Empresa : '',
    ban03Anio: '',
    ban03Mes: '',
    ban03Numero: '',
    ban03clientetipoanalisis: '',
    ban03clienteruc: '',
    ban03Importe:0,
    ban03moneda: '',
    ban03FechaDeposito: '',
    ban03MedioPago: '',
    ban03Motivo: '',
    ban03VoucherLibroCod:'',
    ban03VoucherNumero:'',
  };
  
  editaFormulario:RegistroCobro ={
    ban03Empresa : '',
    ban03Anio: '',
    ban03Mes: '',
    ban03Numero: '',
    ban03clientetipoanalisis: '',
    ban03clienteruc: '',
    ban03Importe:0,
    ban03moneda: '',
    ban03FechaDeposito: '',
    ban03MedioPago: '',
    ban03Motivo: '',
    ban03VoucherLibroCod:'',
    ban03VoucherNumero:'',
  }

   iniciarNuevoRegistro():void{
    this.mostrarNuevaFila = true;
    this.botonesDeshabilitados = true;
    let  fechaActual = new Date();
        const fechaRegistroFormateada = this.datePipe.transform(
            fechaActual,
            'dd/MM/yyyy'
        ); //HH:mm:ss.SSS
    let  anioActual = fechaActual.getFullYear().toString();
    let mesActual = (fechaActual.getMonth() + 1)
            .toString()
            .padStart(2, '0');
  
    this.nuevoFormulario = {
      ban03Empresa : this.globalService.getCodigoEmpresa(),
      ban03Anio: anioActual,
      ban03Mes: mesActual,
      ban03Numero: '',
      ban03clientetipoanalisis: '',
      ban03clienteruc: '',
      ban03Importe:0,
      ban03moneda: '',
      ban03FechaDeposito: fechaRegistroFormateada,
      ban03MedioPago: '',
      ban03Motivo: '',
      ban03VoucherLibroCod:'',
      ban03VoucherNumero:'',
    }
            
  }
  editaRegistro(registro:RegistroCobro) :void{
    this.editingRegCobro[registro.ban03Numero] = true;
    this.monedaOpciones =[
       { label: 'Soles', value: 'S' },
          { label: 'Dólares', value: 'D' }
    ]
  }
  eliminaRegistro() :void{

  }
  cancelarRegistro(): void{
    this.mostrarNuevaFila = false;
    this.botonesDeshabilitados = false;

  }
 
  editingRegCobro: {[key:string]:boolean}={};
  registroSeleccionado: string = '';
 
  constructor(
    private globalService:GlobalService,
    private bs:BreadcrumbService,
    private confirmationService:ConfirmationService,
    private router:Router,
    private messageService:MessageService,
    private datePipe:DatePipe,
    private configService:ConfigService,
    private cobroService:CobroFacturaService
  ){


  }
  ngOnInit(): void {

    this.bs.setBreadcrumbs([
      {icon:'pi pi-home', routerLink:'/Home'},
      {label:'Registro cobro', routerLink:'/Home/registro_cobro'}
    ]);
    this.bs.currentBreadcrumbs$.subscribe((bc) =>{
      this.items = bc;
    });

    this.globalService.selectedDate$.subscribe((date)=>{
        if(date){
          const year = date.getFullYear().toString();
         const month = (date.getMonth() + 1).toString().padStart(2, '0');
                this.anioFecha = year;
                this.mesFecha = month;
        
                this.cargar();
              }

    });
  }

  cargarMedioPago():void{
    const codempresa: string = this.globalService.getCodigoEmpresa();
        this.loading = true;
        
        this.cobroService.getListaMedioPago(codempresa).subscribe({
            next: (data) => {
                
                this.medioPagoLista = data;
                
                this.loading = false;
             
            },
            error: (error) => {
                this.loading = false;
                verMensajeInformativo(
                    this.messageService,
                    'error',
                    'Error',
                    `Error al cargar presupuesto: ${error.message}`
                );
            },
        });
  }

  cargar():void{
    let empresa = this.globalService.getCodigoEmpresa();
    this.loading = true;
    this.cobroService.getListaRegistroCobro(this.globalService.getCodigoEmpresa(),
                      this.anioFecha,this.mesFecha)
                      .subscribe({
                        next:(data) =>{
                          this.listaRegistroCobro = data;
                          this.loading = false;
                          // console.log(this.listaRegistroCobro);
                        },
                        error:(error) =>{
                          this.loading = false;
                          verMensajeInformativo(this.messageService, 'error',
                            'Error', `Error al cargar presupuesto${error.message}`
                          )
                        }
                      })
  }
  actualizarFechaEdicion(event: Date) {
        if (event) {
            // Actualizar año y mes basado en la fecha seleccionada
            this.editaFormulario.ban03Anio = event.getFullYear().toString();
            this.editaFormulario.ban03Mes = (event.getMonth() + 1)
                .toString()
                .padStart(2, '0');
            this.editaFormulario.ban03FechaDeposito =
                this.datePipe.transform(event, 'dd/MM/yyyy') || '';
          }
    }
  guardarNuevo(){
      this.cobroService.insertRegistroCobro(this.nuevoFormulario)
      .subscribe({
          next:(response) =>{
            verMensajeInformativo(this.messageService, 
              'succes', 'Exito', 
              'Registro guardardo');
              this.mostrarNuevaFila = false;
              this.botonesDeshabilitados = false;
              this.cargar();
              const nuevoCodigoRegistroCobro = response.item;
              if(nuevoCodigoRegistroCobro){
                //cargar detalle con codigo recine  generado 

              }
          }
      });
  }
  guardarEdicion(nroRegistroCobro:string){
    this.cobroService.updateRegistroCobro(this.editaFormulario)
    .subscribe({
      next:(response) =>{
        verMensajeInformativo(this.messageService, 'succes', 
          'Exito', 'registro actualizado');
          //libera el registro  del arreglo de la lista de seleccionado
          delete this.editingRegCobro[nroRegistroCobro];
          this.cargar();
      },
      error:(error) =>{
        verMensajeInformativo(this.messageService,'error', 'error',`Error al actualizar ${error.mensaje} `);

      },
    });
  }
  cancelarEdicion(nroRegistroCobro:string){
    delete this.editingRegCobro[nroRegistroCobro];
  }
  
  onCloseMolda(){

  }
  eliminarPago(registro:RegistroCobro){
    this.cobroService.deleteRegistroCobro(registro.ban03Empresa, 
      registro.ban03Anio, registro.ban03Mes, registro.ban03Numero)
      .subscribe({

      });
  }
  iniciarEdicion(registro:TraeRegistroCobro):void{
    console.log(registro);
      this.editingRegCobro[registro.ban03numero] = true;
     
      let obtenerMedioPago = this.medioPagoLista.find(
        (mp) => mp.ban01Descripcion === registro.medioPagoDescripcion
      );
      this.editaFormulario ={
        ban03Empresa :this.globalService.getCodigoEmpresa(),
        ban03Anio:registro.ban03anio,
        ban03Mes:registro.ban03mes,
        ban03Numero: registro.ban03numero,
        ban03clientetipoanalisis:'01',
        ban03clienteruc:registro.clienteCodigo,
        ban03Importe:registro.ban03Importe,
        ban03moneda: registro.ban03moneda,
        ban03FechaDeposito : registro.ban03FechaDeposito,
        ban03MedioPago: obtenerMedioPago ? obtenerMedioPago.ban01IdTipoPago:'',
        ban03Motivo: registro.ban03Motivo,
        ban03VoucherLibroCod: registro.ban03VoucherLibroCod,
        ban03VoucherNumero:registro.ban03VoucherNumero
      }
       this.monedaOpciones = [
          { label: 'Soles', value: 'S' },
          { label: 'Dólares', value: 'D' }
      ];
  }


}
