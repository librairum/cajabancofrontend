import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { GlobalService } from 'src/app/demo/service/global.service';
import { ConfigService } from 'src/app/demo/service/config.service';
import { VoucherContableDetalle } from '../presupuesto';

@Component({
    selector: 'app-actualizar-vouchercontable',
    standalone: true,
    imports: [
        PanelModule,
        ToastModule,
        ButtonModule,
        InputTextModule,
        CalendarModule,
        FileUploadModule,
        CommonModule,
        FormsModule,
        TagModule,
        TooltipModule,
        HttpClientModule,
        DialogModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
    ],
    templateUrl: './actualizar-vouchercontable.component.html',
    styleUrl: './actualizar-vouchercontable.component.css',
    providers: [MessageService, FileUploadModule, ConfirmationService],
})
export class ActualizarVouchercontableComponent implements OnInit {
    //por si acaso el nro de pago de la fila
    @Input() pagoNumero: string;
    @ViewChild('fu') fileUpload!: FileUpload;
    @Output() onClose = new EventEmitter<void>();

    pagoForm: FormGroup;

    fechaEjecucionPago: Date | null = null;
    nroOperacion: string = '';
    rutaComprobante: string = '';
    // despliegue

    // Variables para el diálogo de confirmación
    mostrarDialogoExito: boolean = false;
    mensajeExito: string = '';
    rutaArchivoGuardado: string = '';
    rutaDoc: string = '';

    //combo general
    anio_combo: string = '';
    mes_combo: string = '';
    urlApi: string = '';
    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private pS: PresupuestoService,
        private gS: GlobalService,
        private configService: ConfigService
    ) {
        this.pagoForm = this.fb.group({
            fechaejecucion: [null, Validators.required],
            nroOperacion: ['', Validators.required],
            rutaComprobante: ['', Validators.required],
        });
        this.urlApi = this.configService.getApiUrl();
    }

    ngOnInit(): void {
       /* if (this.pagoNumero) {
            this.nroOperacion = this.pagoNumero;
        }*/
        this.gS.selectedDate$.subscribe((date) => {
            if (date) {
                this.anio_combo = date.getFullYear().toString();
                this.mes_combo = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0');
            }
        });
    }

    /*ngOnChanges(changes: SimpleChanges) {
        // Update nroOperacion whenever pagoNumero changes
        if (changes['pagoNumero'] && changes['pagoNumero'].currentValue) {
          this.nroOperacion = changes['pagoNumero'].currentValue;
        } por si se desea pasar el nro de pago
      }*/

    guardarConfirmacion() {
       
    }

    finalizarGuardado() {
        this.mostrarDialogoExito = true;
    }

    onConfirmOk() {
        this.mostrarDialogoExito = false;
        // Limpiamos y cerramos al confirmar el diálogo
        this.limpiarCampos();
        this.onClose.emit();
    }

    

    limpiarCampos() {
        this.pagoForm.reset();
        this.fechaEjecucionPago = null;
        this.nroOperacion = '';
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    cancelar() {
        this.limpiarCampos();
        this.onClose.emit();
    }


    private formatDate(date: Date): string {
        const day = (date.getDate() + 1).toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
