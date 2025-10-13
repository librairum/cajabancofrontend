import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { GlobalService } from 'src/app/demo/service/global.service';
import { CobroFacturaService } from 'src/app/demo/service/cobrofactura.service';
import { AgregaFacturaxcobrarComponent } from "../agrega-facturaxcobrar/agrega-facturaxcobrar.component";
import { RegistroCobroDetalle } from 'src/app/demo/model/CuentaxCobrar';
import { RegistroCobroDocSustento } from 'src/app/demo/model/CuentaxCobrar';
import { verMensajeInformativo } from '../../utilities/funciones_utilitarias';
interface FacturaDetalle {
  numero: string;
  fecha: Date;
  moneda: string;
  importeOriginal: number;
  importePagado: number;
  observaciones?: string;
  item?: number;
  tipodoc?: string;
}



@Component({
  selector: 'app-registro-cobro-detalle',
  standalone: true,
  imports: [
    BreadcrumbModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    PanelModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DialogModule,
    AgregaFacturaxcobrarComponent
  ],
  templateUrl: './registro-cobro-detalle.component.html',
  styleUrl: './registro-cobro-detalle.component.css',
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class RegistroCobroDetalleComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  navigationData: any;
  items: any[] = [];
  
  // Campos de formulario
  cobroNro: string = '';
  fecha: Date = new Date();
  clienteNombre: string = '';
  clienteCodigo: string = '';
  empresa: string = '';
  
  // Tablas
  facturasAfectadas: FacturaDetalle[] = [];
  listaSustentos: RegistroCobroDocSustento[] = [];
  
  load: boolean = false;
  
  // Edición
  editingFactura: FacturaDetalle | null = null;
  editingSustento: RegistroCobroDocSustento | null = null;
  isAnyRowEditing: boolean = false;
  displayModal: boolean = false;

  constructor(
    private messageService: MessageService,
    private bs: BreadcrumbService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private globalService: GlobalService,
    private cobroService: CobroFacturaService
  ) {
    const navigation = router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.navigationData = navigation.extras.state;
    } else {
      this.router.navigate(['Home/registro-cobro']);
    }
  }

  ngOnInit(): void {
    this.bs.setBreadcrumbs([
      { icon: 'pi pi-home', routerLink: '/Home' },
      { label: 'Registro de Cobro', routerLink: '/Home/registro_cobro' },
      { label: 'Detalle', routerLink: '/Home/registro_cobro_detalle' },
    ]);
    
    this.bs.currentBreadcrumbs$.subscribe((bc) => {
      this.items = bc;
    });
    
    this.valoresCampos();
    
    setTimeout(() => {
      this.cargarDetalles();
    }, 100);
  }

  valoresCampos() {
    this.cobroNro = this.navigationData?.CobroNro || this.navigationData?.ban03numero || '';
    this.clienteNombre = this.navigationData?.Cliente || '';
    this.clienteCodigo = this.navigationData?.ClienteCodigo || this.navigationData?.clienteCodigo || '';
    
    this.empresa = this.navigationData?.ban03empresa || 
                   this.globalService.getCodigoEmpresa() || 
                   '01';
    
    const fechaString = this.navigationData?.Fecha || this.navigationData?.ban03FechaDeposito;
    if (fechaString) {
      const [day, month, year] = fechaString.split('/').map(Number);
      this.fecha = new Date(year, month - 1, day);
    } else {
      this.fecha = new Date();
    }
  }
  
  cargarDetalles() {

    this.getlistaSustento(this.empresa,this.cobroNro);
    if (!this.empresa || !this.cobroNro) {
      this.facturasAfectadas = [];
      return;
    }

    this.load = true;
    
    this.cobroService.getListaDetalle(this.empresa, this.cobroNro).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          this.facturasAfectadas = [];
          this.load = false;
          return;
        }
        
        this.facturasAfectadas = [];
        
        this.facturasAfectadas = response.map((detalle, index) => {
          const moneda = this.determinarMoneda(
            detalle.importeOriginalSoles, 
            detalle.importeOriginalDolares
          );
          
          const importeOriginal = moneda === 'Soles' 
            ? parseFloat(detalle.importeOriginalSoles) || 0
            : parseFloat(detalle.importeOriginalDolares) || 0;
          
          const importePagado = moneda === 'Soles'
            ? parseFloat(detalle.importePagadoSoles) || 0
            : parseFloat(detalle.importePagadoDolares) || 0;

          return {
            numero: detalle.nroDocumento,
            fecha: this.parsearFecha(detalle.fechaDocumento),
            moneda: moneda,
            importeOriginal: importeOriginal,
            importePagado: importePagado,
            observaciones: 'Observaciones',
            item: index + 1,
            tipodoc: '01'
          };
        });
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Se cargaron ${this.facturasAfectadas.length} factura(s)`
        });
        
        this.load = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los detalles del cobro'
        });
        this.facturasAfectadas = [];
        this.load = false;
      }
    });
    
  }

  determinarMoneda(importeSoles: string, importeDolares: string): string {
    const soles = parseFloat(importeSoles) || 0;
    const dolares = parseFloat(importeDolares) || 0;
    
    if (soles > 0 && dolares === 0) return 'Soles';
    if (dolares > 0 && soles === 0) return 'Dólares';
    if (soles > dolares) return 'Soles';
    return 'Dólares';
  }

  parsearFecha(fechaString: string): Date {
    if (!fechaString) return new Date();
    
    const partes = fechaString.split('/');
    if (partes.length === 3) {
      const [day, month, year] = partes.map(Number);
      return new Date(year, month - 1, day);
    }
    
    return new Date(fechaString);
  }

  // ==================== MÉTODOS PARA FACTURAS AFECTADAS ====================
  
  agregarNuevaFactura() {
    this.displayModal = true;
  }

  onCloseModal() {
    this.displayModal = false;
  }

  onFacturasSeleccionadas(xmlDetalle: string) {
    if (!xmlDetalle) {
      return;
    }

    const body = {
      ban04Empresa: this.empresa,
      ban04Numero: this.cobroNro,
      xmlDetalle: xmlDetalle,
      ban04Observacion: 'Facturas insertadas masivamente'
    };

    this.cobroService.insertarDetalleXML(body).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Facturas agregadas correctamente'
        });

        this.displayModal = false;

        setTimeout(() => {
          this.cargarDetalles();
        }, 300);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error al insertar facturas: ${error.message || 'Error desconocido'}`
        });
      }
    });
  }

  startEditingFactura(factura: FacturaDetalle) {
    if (this.isAnyRowEditing) return;
    this.editingFactura = { ...factura };
    this.isAnyRowEditing = true;
  }

  saveEditingFactura() {
    if (this.editingFactura) {
      const pagoSoles = this.editingFactura.moneda === 'Soles' 
        ? this.editingFactura.importePagado 
        : 0;
      
      const pagoDolares = this.editingFactura.moneda === 'Dólares' 
        ? this.editingFactura.importePagado 
        : 0;

      this.cobroService.actualizaDetalle(
        this.empresa,
        this.cobroNro,
        this.editingFactura.item || 0,
        this.editingFactura.tipodoc || 'FAC',
        this.editingFactura.numero,
        pagoSoles,
        pagoDolares,
        this.editingFactura.observaciones || ''
      ).subscribe({
        next: () => {
          const index = this.facturasAfectadas.findIndex(
            f => f.numero === this.editingFactura!.numero
          );
          if (index !== -1) {
            this.facturasAfectadas[index] = { ...this.editingFactura! };
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Factura actualizada correctamente'
          });
          this.cancelEditingFactura();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la factura'
          });
        }
      });
    }
  }

  cancelEditingFactura() {
    this.editingFactura = null;
    this.isAnyRowEditing = false;
  }

  eliminarFactura(factura: FacturaDetalle) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la factura ${factura.numero}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.cobroService.eliminarDetale(
          this.empresa,
          this.cobroNro,
          factura.item || 0,
          factura.tipodoc || 'FAC',
          factura.numero
        ).subscribe({
          next: () => {
            this.facturasAfectadas = this.facturasAfectadas.filter(
              f => f.numero !== factura.numero
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Factura eliminada correctamente'
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la factura'
            });
          }
        });
      }
    });
  }
  // ======================== metodo sustento con bd =========================
  
  insertSustento(){
    
  }
  // ==================== MÉTODOS PARA SUSTENTOS ADJUNTOS ====================
     base64ToBlob(base64: string, contentType: string = '', sliceSize: number = 512): Blob {
    // 1. Eliminar el prefijo 'data:...' si existe
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    
    // 2. Decodificar la cadena Base64
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    // 3. Crear y retornar el Blob
    return new Blob(byteArrays, { type: contentType });
  }
  abrirdocumento(registro: RegistroCobroDocSustento): void {
          this.cobroService
              .traeDocumentoSustento(
                  this.globalService.getCodigoEmpresa(),
                  this.cobroNro,registro.ban05Item
              )
              .subscribe({
                  next: (response) => {
                      const blob = response.body;
                      //const mimeType = 'application/pdf'; // <<-- AJUSTAR ESTE VALOR
      
                      //const blob = this.base64ToBlob(base64contenido, mimeType);

                      //const blob = response.body;
                      if (blob) {
                          const url = window.URL.createObjectURL(blob);
                          window.open(url, '_blank');
                      } else {
                          verMensajeInformativo(
                              this.messageService,
                              'error',
                              'Error',
                              'No se encontró el documento'
                          );
                      }
                  },
                  error: (err) => {
                      console.error('Error al obtener el documento: ', err);
                  },
              });
      }

  verSustento(registro:RegistroCobroDocSustento){
    
    // this.cobroService.traeDocumentoSustento(this.empresa, this.cobroNro,registro.ban05Item.subscribe({
    //   next:(response) =>{

    //   },error:(error)=>{

    //   }
    // }));
  } 


  agregarNuevoSustento() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
   const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const archivos = Array.from(input.files);
      this.cobroService.SubirArchivo('01',this.cobroNro, archivos).subscribe({
        next: (response) => {
          this.messageService.add({
            severity:'succces',
            summary:'exito',
            detail:'Sustento  registrado corretamente'
          });
          setTimeout(() => {
            this.getlistaSustento(this.empresa, this.cobroNro);
          }, 300);
        },error:(error)  =>{
          this.messageService.add({             
            severity: 'error',
            summary: 'Error',
            detail: `Error al insertar facturas: ${error.message || 'Error desconocido'}`
          });
        }
      });


    }

  }

  insertarSustento(registro: RegistroCobroDocSustento) {
   
  }

  obtenerNombreSinExtension(nombreArchivo: string): string {
    const ultimoPunto = nombreArchivo.lastIndexOf('.');
    if (ultimoPunto === -1) {
      return nombreArchivo;
    }
    return nombreArchivo.substring(0, ultimoPunto);
  }

  startEditingSustento(registro: RegistroCobroDocSustento) {
    if (this.isAnyRowEditing) return;
    this.editingSustento = { ...registro };
    this.isAnyRowEditing = true;

  }

  saveEditingSustento(registro:RegistroCobroDocSustento) {
    if (this.editingSustento) {
      this.cobroService.actualizarDocumentoSustento(registro)
      .subscribe({
        next: (response) => {
          this.getlistaSustento(this.empresa,this.cobroNro);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Sustento actualizado correctamente'
          });
          this.cancelEditingSustento();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el sustento'
          });
        }
      });
    }
  }

  cancelEditingSustento() {
     this.editingSustento = null;
    this.isAnyRowEditing = false;
  }

  eliminarSustento(registro: RegistroCobroDocSustento) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el archivo ${registro.ban05NombreArchivo}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.cobroService.eliminarDocumentoSustento(this.empresa, 
          this.cobroNro,registro.ban05Item)
        .subscribe({
          next: (response) => {
          this.getlistaSustento(this.empresa,this.cobroNro);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Sustento eliminado correctamente'
            });
            
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el sustento'
            });
          }
        });
      }
    });
  }

  getlistaSustento(empresa:string, numeroRegistroCobroCab:string) {
    this.cobroService.listarSustento(empresa, numeroRegistroCobroCab).subscribe({
      next:(response) =>{
        this.listaSustentos = response;
        
        console.log(this.listaSustentos);

      },
      error:(error) =>{
        verMensajeInformativo(this.messageService, 
          'error', 'Error', 
          `Error al traer lista de sustentos:${error.message}`);
      }
    });
    
  }

  getTotalFacturas(field: keyof FacturaDetalle): number {
    return this.facturasAfectadas.reduce(
      (sum, item) => sum + (Number(item[field]) || 0),
      0
    );
  }
}