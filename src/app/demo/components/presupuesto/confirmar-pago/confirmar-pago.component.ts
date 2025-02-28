import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
@Component({
    selector: 'app-confirmar-pago',
    standalone: true,
    imports: [PanelModule, ToastModule, ButtonModule, InputTextModule, CalendarModule, FileUploadModule, CommonModule, FormsModule, TagModule, TooltipModule, HttpClientModule,DialogModule,
        ConfirmDialogModule],
    templateUrl: './confirmar-pago.component.html',
    styleUrl: './confirmar-pago.component.css',
    providers: [MessageService, FileUploadModule,ConfirmationService]
})
export class ConfirmarPagoComponent implements OnInit {

    //por si acaso el nro de pago de la fila
    @Input() pagoNumero: string = '';
    @ViewChild('fu') fileUpload!: FileUpload;
    @Output() onClose = new EventEmitter<void>();

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

    constructor(private messageService: MessageService, private pS: PresupuestoService) {

    }

    ngOnInit(): void {
        if (this.pagoNumero) {
            this.nroOperacion = this.pagoNumero;
        }
    }

    /*ngOnChanges(changes: SimpleChanges) {
        // Update nroOperacion whenever pagoNumero changes
        if (changes['pagoNumero'] && changes['pagoNumero'].currentValue) {
          this.nroOperacion = changes['pagoNumero'].currentValue;
        } por si se desea pasar el nro de pago
      }*/

    guardarConfirmacion() {
        // Verificar que todos los campos esten llenos
        if (!this.fechaEjecucionPago) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'La fecha de ejecución es requerida'
            });
            return false;
        }

        if (!this.nroOperacion) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El número de operación es requerido'
            });
            return false;
        }

        if (!this.archivoSeleccionado) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe adjuntar un comprobante'
            });
            return false;
        }

        // Si hay un archivo seleccionado, subirlo primero
        if (this.archivoSeleccionado) {
            this.cargandoArchivo = true;
            this.pS.simularSubidaArchivo(this.archivoSeleccionado).subscribe({
                next: (rutaGuardada) => {
                    this.rutaComprobante = rutaGuardada;
                    this.rutaArchivoGuardado = `src\\${rutaGuardada}`;
                    this.finalizarGuardado();
                    this.cargandoArchivo = false;
                },
                error: (error) => {
                    console.error('Error al subir archivo:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo subir el comprobante'
                    });
                    this.cargandoArchivo = false;
                }
            });
        } else {
            this.finalizarGuardado();
        }

        return true;
    }

    finalizarGuardado() {
        // Aquí en un futuro ira la lógica para guardar el registro de pago para la db
        console.log('Guardando confirmación de pago');
        console.log('Número de pago:', this.pagoNumero);
        console.log('Fecha de ejecución:', this.fechaEjecucionPago);
        console.log('Número de operación:', this.nroOperacion);
        console.log('Ruta de comprobante guardado:', this.rutaComprobante);

        // En lugar de mostrar un toast, mostramos el diálogo de confirmación
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
            this.archivoSeleccionado = event.files[0]; // Asignar el archivo
            this.rutaComprobante = event.files[0].name;
            console.log('Archivo seleccionado:', this.archivoSeleccionado);
        }
    }

    limpiarArchivo() {
        this.rutaComprobante = '';
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    limpiarCampos() {
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
        this.fechaEjecucionPago = null;
        this.nroOperacion = '';
        this.rutaComprobante = '';
        this.archivoSeleccionado = null;
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }



}
