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
import { FileUploadModule } from 'primeng/fileupload';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DatosSeleccionados, ObtenerCuentaCorriente, ObtenerCuentaHaby, ObtenerInformacion, obtenerTipoDocumento, VoucherContableDetalle } from '../presupuesto';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RegContableDetService } from 'src/app/demo/service/reg-contable-det.service';
import { last } from 'rxjs';

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
        CheckboxModule,
        DropdownModule,
    ],
    templateUrl: './actualizar-vouchercontable.component.html',
    styleUrl: './actualizar-vouchercontable.component.css',
    providers: [MessageService, FileUploadModule, ConfirmationService],
})
export class ActualizarVouchercontableComponent implements OnInit {
    //por si acaso el nro de pago de la fila
    @Input() detalleSelected: VoucherContableDetalle;
    @Output() onClose = new EventEmitter<void>();

    vouchercontableForm: FormGroup;
    actVCForm: FormGroup;
    infoAdicional: ObtenerInformacion;

    // despliegue

    // Variables para el diálogo de confirmación
    mostrarDialogoExito: boolean = false;
    mensajeExito: string = '';

    // Inicializamos  listas de los conboox o p-dropdown
    cuentas: any[] = [];
    cuentasCorrientes: any[] = [];
    tipoDocumentos: any[] = [];
    informacionDetallada: any;

    //checkbox
    afectoRetencion = false;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private regContableService: RegContableDetService
    ) {}

    ngOnInit(): void {
        this.cargarDatosActualizar();
        this.obtenerCuenta(); // obtiene cuenta de HabyMov del Servicio Reg Contable
        this.obtenerCuentaCorriente();
        this.obtenerTipoDocumento();
    }

    //Inicializamos los datos del servicio para los dropdown
    ayudaHabyMovList: ObtenerCuentaHaby[] = [];
    ayudaCuentaCorriente: ObtenerCuentaCorriente[] = [];
    ayudaTipoDocumento: obtenerTipoDocumento[] = [];

    obtenerCuenta() {
        this.regContableService.obtenerCuenta().subscribe({
            next: (data) => {
                this.ayudaHabyMovList = data;
                this.cuentas = this.ayudaHabyMovList.map((item) => ({
                    labelCuenta: item.ccm01des,
                    valueCuenta: item.ccm01cta,
                }));
            },
            error: (err) => {
                console.error('Error al obtener datos:', err);
            },
        });
    }

    obtenerCuentaCorriente() {
        this.regContableService.obtenerCuentaCorriente().subscribe({
            next: (data) => {
                this.ayudaCuentaCorriente = data;
                this.cuentasCorrientes = this.ayudaCuentaCorriente.map(
                    (item) => ({
                        labelCCorriente: item.ccm02nom,
                        valueCCorriente: item.ccm02cod,
                    })
                );
                console.log(this.cuentasCorrientes);
            },
            error: (err) => {
                console.error('Error al obtener datos:', err);
            },
        });
    }

    obtenerTipoDocumento() {
        this.regContableService.obtenerTipoDocumentos().subscribe({
            next: (data) => {
                this.ayudaTipoDocumento = data;
                this.tipoDocumentos = this.ayudaTipoDocumento.map(
                    (item) => ({
                        labelTDocumento: item.ccb02des,
                        valueTDocumento: item.ccb02cod,
                    })
                );
                console.log('Tipo doc: ', this.tipoDocumentos);
            },
            error: (err) => {
                console.error('Error al obtener datos:', err);
            },
        });
    }

    cargarDatosAdicionales(){
        this.regContableService.obtenerInformacionDetallada(this.detalleSelected.anio, this.detalleSelected.mes, this.detalleSelected.libro, this.detalleSelected.numeroVoucher, this.detalleSelected.orden).subscribe({
            next: (data: ObtenerInformacion) => {
                this.infoAdicional = data
            }
        })
        return this.infoAdicional;
    }

    cargarDatosActualizar() {
        console.log('Detalle recibido:', this.detalleSelected); // Verifica si los datos llegan correctamente
        console.log('info', this.cargarDatosAdicionales());
        const fechaVenc = this.formatFecha(
            this.detalleSelected.fechaVencimiento
        );
        this.actVCForm = this.fb.group({
            cuenta: [this.detalleSelected.cuenta || ''],
            cuenta2: [''],
            comprobante: [this.detalleSelected.amarre || ''],
            glosa: [''],
            centroCosto: [''],
            centroGestion: [''],
            maquina: [''],
            trabajoCurso: [''],
            cuentaCorriente: [''],
            tipDoc: [''],
            nroDoc: [this.detalleSelected.numDoc || ''],
            fechaDoc: [null],
            AnioDUA: [''],
            fechaVencim: [null],
            fechaPago: [null],
            numeroPago: [''],
            tipoDocDocModifica: [''],
            numeroDocModifica: [''],
            fechaDocModifica: [null],
            columna: [''],
            moneda: [''],
            tipoCambio: [''],
            debe: [''],
            debe2: [''],
            haber: [''],
            haber2: [''],
            afectoRet: [''],
            tipTranRet: [''],
            tipDocRet: [''],
            numeroRet: [''],
            fechaRet: [null],
            fechaPagoRet: [null],
        });

        // Inicializar el formulario
        this.vouchercontableForm = this.fb.group({
            orden: [this.detalleSelected.orden || ''],
            amarre: [this.detalleSelected.amarre || ''],
            cuenta: [this.detalleSelected.cuenta || ''],
            ctaCbleDesc: [this.detalleSelected.ctaCbleDesc || ''],
            concepto: [this.detalleSelected.concepto || ''],
            ctactecod: [this.detalleSelected.ctactecod || ''],
            ctaCteDesc: [this.detalleSelected.ctaCteDesc || ''],
            afecto: [this.detalleSelected.afecto || ''],
            moneda: [this.detalleSelected.moneda || ''],
            tipoDocumento: [this.detalleSelected.tipoDocumento || ''],
            tipDocDes: [this.detalleSelected.tipDocDes || ''],
            numDoc: [this.detalleSelected.numDoc || ''],
            fechaDoc: [this.detalleSelected.fechaDoc || ''],
            fechaVencimiento: [fechaVenc], // Fecha convertida correctamente
            tipoCambio: [this.detalleSelected.tipoCambio || ''],
            importeDebe: [this.detalleSelected.importeDebe || ''],
            importeHaber: [this.detalleSelected.importeHaber || ''],
            importeDebeEquivalencia: [
                this.detalleSelected.importeDebeEquivalencia || '',
            ],
            importeHaberEquivalencia: [
                this.detalleSelected.importeHaberEquivalencia || '',
            ],
            cencos: [this.detalleSelected.cencos || ''],
            cCostoDesc: [this.detalleSelected.cCostoDesc || ''],
            cenGes: [this.detalleSelected.cenGes || ''],
            cGestionDesc: [this.detalleSelected.cGestionDesc || ''],
            totalRecords: [this.detalleSelected.totalRecords || ''],
        });
        // Asignar valores al formulario
        this.vouchercontableForm.patchValue(this.detalleSelected);
        console.log('registro a actualizar', this.vouchercontableForm.value);
    }

    /*ngOnChanges(changes: SimpleChanges) {
        // Update nroOperacion whenever pagoNumero changes
        if (changes['pagoNumero'] && changes['pagoNumero'].currentValue) {
          this.nroOperacion = changes['pagoNumero'].currentValue;
        } por si se desea pasar el nro de pago
      }*/

    guardarConfirmacion() {}

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
        this.vouchercontableForm.reset();
    }

    cancelar() {
        this.limpiarCampos();
        this.onClose.emit();
    }

    //Convierte una fecha de "dd/mm/aaaa" a "yyyy-mm-dd" para input type="date"

    formatFecha(fecha: string): Date | null {
        if (!fecha) return null; // Si la fecha es null o vacía, retornamos null
        const partes = fecha.split('/');
        if (partes.length !== 3) return null; // Validamos que tenga tres partes
        const [dia, mes, anio] = partes.map(Number); // Convertimos los valores a números
        if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return null; // Validamos que sean números válidos
        return new Date(anio, mes - 1, dia); // Retornamos un objeto Date (mes en base 0)
    }
}
