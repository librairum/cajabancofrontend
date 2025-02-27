import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
@Component({
    selector: 'app-confirmar-pago',
    standalone: true,
    imports: [PanelModule, ToastModule, ButtonModule, InputTextModule, CalendarModule, FileUploadModule,CommonModule,FormsModule,TagModule,TooltipModule],
    templateUrl: './confirmar-pago.component.html',
    styleUrl: './confirmar-pago.component.css',
    providers: [MessageService]
})
export class ConfirmarPagoComponent implements OnInit {

    //por si acaso el nro de pago de la fila
    @Input() pagoNumero: string = '';
    @ViewChild('fu') fileUpload!: FileUpload;
    @Output() onClose = new EventEmitter<void>();

    fechaEjecucionPago: Date | null = null;
    nroOperacion: string = '';
    rutaComprobante: string = '';

    constructor(private messageService: MessageService) {

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
        }
      }*/

    guardarConfirmacion() {
        //simular guardar
        console.log('Guardando confirmación de pago');
        console.log('Número de pago:', this.pagoNumero);
        console.log('Fecha de ejecución:', this.fechaEjecucionPago);
        console.log('Número de operación:', this.nroOperacion);
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pago confirmado correctamente'
        });

        // Clear fields after saving
        this.limpiarCampos();

        return true;
    }

    onFileSelected(event: any) {
        if (event && event.files && event.files.length > 0) {
            this.rutaComprobante = event.files[0].name;
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

        // Reset file upload
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    cancelar() {
        // Clear fields and return
        this.limpiarCampos();
        this.onClose.emit();
    }



}
