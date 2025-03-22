import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { GlobalService } from 'src/app/demo/service/global.service';
import { ConfigService } from 'src/app/demo/service/config.service';
@Component({
    selector: 'app-confirmar-pago',
    standalone: true,
    imports: [PanelModule, ToastModule, ButtonModule, InputTextModule, CalendarModule, FileUploadModule, CommonModule, FormsModule, TagModule, TooltipModule, HttpClientModule, DialogModule,
        ConfirmDialogModule, ReactiveFormsModule],
    templateUrl: './confirmar-pago.component.html',
    styleUrl: './confirmar-pago.component.css',
    providers: [MessageService, FileUploadModule, ConfirmationService]
})
export class ConfirmarPagoComponent implements OnInit {

    //por si acaso el nro de pago de la fila
    @Input() pagoNumero: string = '';
    @ViewChild('fu') fileUpload!: FileUpload;
    @Output() onClose = new EventEmitter<void>();

    pagoForm: FormGroup;

    fechaEjecucionPago: Date | null = null;
    nroOperacion: string = '';
    rutaComprobante: string = '';
    // despliegue
    archivoSeleccionado: File | null = null;
    cargandoArchivo: boolean = false;

    // Variables para el diálogo de confirmación
    mostrarDialogoExito: boolean = false;
    mensajeExito: string = '';
    rutaArchivoGuardado: string = '';
    rutaDoc:string='';

    //combo general
    anio_combo: string = "";apiUrl: any;
;
    mes_combo: string = "";
    urlApi : string = '';
    constructor(private fb: FormBuilder, private messageService: MessageService, private pS: PresupuestoService, private gS: GlobalService,
        private configService: ConfigService) {
        this.pagoForm = this.fb.group({
            fechaejecucion: [null,Validators.required],
            nroOperacion: ['',Validators.required],
            rutaComprobante: ['',Validators.required]
        });
        
      this.apiUrl = (window as any).config?.url
        this.urlApi = this.apiUrl;
    }

    ngOnInit(): void {
    
        if (this.pagoNumero) {
            this.nroOperacion = this.pagoNumero;
        }
        this.gS.selectedDate$.subscribe(date => {
            if (date) {
                this.anio_combo = date.getFullYear().toString();
                this.mes_combo = (date.getMonth() + 1).toString().padStart(2, '0');
            }
        })
    }

    /*ngOnChanges(changes: SimpleChanges) {
        // Update nroOperacion whenever pagoNumero changes
        if (changes['pagoNumero'] && changes['pagoNumero'].currentValue) {
          this.nroOperacion = changes['pagoNumero'].currentValue;
        } por si se desea pasar el nro de pago
      }*/

    guardarConfirmacion() {
        // Verificar que todos los campos esten llenos
        this.pagoForm.markAllAsTouched();
        if (this.pagoForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete todos los campos requeridos'
            });
            return;
        }
//
        this.cargandoArchivo = true;
        const destinationPath = 'D:/GMINGENIEROS/fronent/cajabancofrontend/src/assets/documentos';
        //const destinationPath = this.rutaDoc;
        const originalFileName = this.archivoSeleccionado?.name || '';
        const fileName = originalFileName.split('.').length > 1
            ? originalFileName
            : originalFileName + '.' + originalFileName.split('.').pop();

        const fileUrl = `http://localhost:4200/assets/documentos/${fileName}`;

        this.pS.subirArchivo(this.archivoSeleccionado, destinationPath).subscribe({
            next: (event) => {
                const fechaPagoInput = this.pagoForm.get('fechaejecucion')?.value;
                const fechaPagoFormatted = fechaPagoInput
                    ? this.formatDate(new Date(fechaPagoInput))
                    : null;
                //parametros
                const updateParams = {
                    empresa: this.gS.getCodigoEmpresa(),
                    anio: this.anio_combo,
                    mes: this.mes_combo,
                    numeropresupuesto: this.pagoNumero,
                    flagOperacion: 'I',
                    fechapago: fechaPagoFormatted, // Fecha formateada como dd/mm/yyyy
                    numerooperacion: this.pagoForm.get('nroOperacion')?.value,
                    enlacepago: fileUrl

                }

                //actualizamos
                this.pS.actualizarComprobante(updateParams).subscribe({
                    next: (response) => {

                        setTimeout(() => {
                            this.cargandoArchivo=false;
                            this.finalizarGuardado();
                          }, 500);
                    },
                    error: (error) => {
                        this.cargandoArchivo = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo actualizar el comprobante'
                        });
                        this.cargandoArchivo = false;
                    }
                });
            }
        })
    }

    finalizarGuardado() {
        this.mensajeExito = `El archivo ${this.archivoSeleccionado?.name} se ha guardado correctamente`;
        this.mostrarDialogoExito = true;
    }

    onConfirmOk() {
        this.mostrarDialogoExito = false;
        // Limpiamos y cerramos al confirmar el diálogo
        this.limpiarCampos();
        this.onClose.emit();
    }

    onFileSelected(event: any) {
        if (event && event.files && event.files.length > 0) {
            this.archivoSeleccionado = event.files[0];
            this.rutaComprobante = event.files[0].name;
            // actualizar el valor
            this.pagoForm.patchValue({
                rutaComprobante: this.rutaComprobante
            });
        }
    }

    limpiarArchivo() {
        this.rutaComprobante = '';
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    limpiarCampos() {
        this.pagoForm.reset();
        this.fechaEjecucionPago = null;
        this.nroOperacion = '';
        this.rutaComprobante = '';
        this.archivoSeleccionado = null;
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    cancelar() {
        this.limpiarCampos();
        this.onClose.emit();
    }

    public limpiar(): void {
        this.pagoForm.reset();
        this.fechaEjecucionPago = null;
        this.nroOperacion = '';
        this.rutaComprobante = '';
        this.archivoSeleccionado = null;
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    private formatDate(date: Date): string {
        const day = (date.getDate()+1).toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }



}
