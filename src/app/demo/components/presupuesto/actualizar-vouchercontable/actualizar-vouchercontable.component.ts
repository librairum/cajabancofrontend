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
import { DatosSeleccionados, InfoVoucherCompleto, ObtenerCuentaCorriente, ObtenerCuentaHaby, ObtenerInformacion, obtenerTipoDocumento, VoucherContableDetalle } from '../presupuesto';
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
    infoAdicional: InfoVoucherCompleto;

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

    monedas: any[] = [
        { label: 'Soles', value: 'S' },
        { label: 'Dólares', value: 'D' },
    ];

    ngOnInit(): void {
        this.actVCForm = this.fb.group({
            cuenta: [''],
            cuenta2: [''],
            comprobante: [''],
            glosa: [''],
            centroCosto: [''],
            centroGestion: [''],
            maquina: [''],
            trabajoCurso: [''],
            cuentaCorriente: [''],
            tipDoc: [''],
            nroDoc: [''],
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

        this.obtenerCuenta(); // obtiene cuenta de HabyMov del Servicio Reg Contable
        this.obtenerCuentaCorriente();
        this.obtenerTipoDocumento();
        this.cargarDatosActualizar();
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
                this.tipoDocumentos = this.ayudaTipoDocumento.map((item) => ({
                    labelTDocumento: item.ccb02des,
                    valueTDocumento: item.ccb02cod,
                }));
                console.log('Tipo doc: ', this.tipoDocumentos);
            },
            error: (err) => {
                console.error('Error al obtener datos:', err);
            },
        });
    }

    cargarDatosAdicionales() {
        this.regContableService
            .obtenerInformacionDetallada(
                this.detalleSelected.anio,
                this.detalleSelected.mes,
                this.detalleSelected.libro,
                this.detalleSelected.numeroVoucher,
                this.detalleSelected.orden
            )
            .subscribe({
                next: (data: InfoVoucherCompleto) => {
                    this.infoAdicional = data;
                },
            });
        return this.infoAdicional;
    }

    cargarDatosActualizar() {
        console.log('Detalle recibido:', this.detalleSelected); // Verifica si los datos llegan correctamente

        const fechaVenc = this.formatFecha(
            this.detalleSelected.fechaVencimiento
        );

        this.obtenerDatos();
    }

    obtenerDatos(): void {
        if (!this.detalleSelected) {
            console.error('No hay detalle seleccionado');
            return;
        }

        this.actVCForm.patchValue({
            cuenta: this.detalleSelected.cuenta || '',
        });

        this.regContableService
            .obtenerInformacionDetallada(
                this.detalleSelected.anio,
                this.detalleSelected.mes,
                this.detalleSelected.libro,
                this.detalleSelected.numeroVoucher,
                this.detalleSelected.orden
            )
            .subscribe({
                next: (data: InfoVoucherCompleto) => {
                    this.infoAdicional = data;
                    console.log('infoAdicional', this.infoAdicional);

                    this.actVCForm.patchValue({
                        glosa: this.infoAdicional[0].glosa || '',
                        comprobante: this.infoAdicional[0].comprobante || '',
                        centroCosto: this.infoAdicional[0].cencos || '',
                        centroGestion: this.infoAdicional[0].cenges || '',
                        maquina: this.infoAdicional[0].codigoMaquina || '',
                        trabajoCurso: [''],
                        cuentaCorriente:
                            this.infoAdicional[0].cuentaCorriente || '',
                        tipDoc: this.infoAdicional[0].tipoDocumento || '',
                        nroDoc: this.infoAdicional[0].numDoc || '',
                        fechaDoc: this.infoAdicional[0].fechaDoc || '',
                        AnioDUA: this.infoAdicional[0].anioDua || '',
                        fechaVencim:
                            this.infoAdicional[0].fechaVencimiento || '',
                        fechaPago: this.infoAdicional[0].fechaRetencion || '',
                        numeroPago: this.infoAdicional[0].nroPago || '',
                        tipoDocDocModifica:
                            this.infoAdicional[0].docModTipo || '',
                        numeroDocModifica:
                            this.infoAdicional[0].docModNumero || '',
                        fechaDocModifica:
                            this.infoAdicional[0].docModFecha || '',
                        columna: this.infoAdicional[0].afecto || '',
                        moneda: this.infoAdicional[0].moneda || '',
                        tipoCambio:
                            Number(this.infoAdicional[0].tipoCambio).toFixed(
                                2
                            ) || '',
                        debe:
                            Number(this.infoAdicional[0].importeDebe).toFixed(
                                2
                            ) || '',
                        debe2:
                            Number(
                                this.infoAdicional[0].importeDebeEquivalencia
                            ).toFixed(2) || '',
                        haber:
                            Number(this.infoAdicional[0].importeHaber).toFixed(
                                2
                            ) || '',
                        haber2:
                            Number(
                                this.infoAdicional[0].importeHaberEquivalencia
                            ).toFixed(2) || '',
                        tipTranRet: this.infoAdicional[0].numDoc || '',
                        tipDocRet: this.infoAdicional[0].tipoDocRetencion || '',
                        numeroRet: this.infoAdicional[0].numDoc || '',
                        fechaRet: this.infoAdicional[0].fechaRetencion || '',
                        fechaPagoRet:
                            this.infoAdicional[0].fechaPagoRetencion || '',
                    });
                },
                error: (err) => {
                    console.error('Error al obtener los datos', err);
                },
            });
    }

    guardarConfirmacion() {
        const datosActualizar = {
            codigoEmpresa: '01',
            anio: this.detalleSelected.anio,
            mes: this.detalleSelected.mes,
            libro: this.detalleSelected.libro,
            numeroVoucher: this.detalleSelected.numeroVoucher,
            cuenta: this.actVCForm.value.cuenta,
            importeDebe: parseFloat(this.actVCForm.value.debe) || 0,
            importeHaber: parseFloat(this.actVCForm.value.haber) || 0,
            glosa: this.retornarInfo(this.actVCForm.value.glosa),
            tipoDocumento: this.actVCForm.value.tipDoc,
            numDoc: this.actVCForm.value.nroDoc,
            fechaDoc: this.formatFechaString(this.actVCForm.value.fechaDoc),
            fechaVencimiento: this.formatFechaString(this.actVCForm.value.fechaVencim),
            cuentaCorriente: this.actVCForm.value.cuentaCorriente,
            moneda: this.actVCForm.value.moneda,
            tipoCambio: parseFloat(this.actVCForm.value.tipoCambio) || 0,
            afecto: this.actVCForm.value.columna,
            cenCos: this.actVCForm.value.centroCosto,
            cenGes: this.actVCForm.value.centroGestion,
            asientoTipo: '', // Agregar este valor o usar uno existente
            valida: this.retornarInfo(this.actVCForm.value.valida),
            fechaVoucher: this.formatFechaString(this.actVCForm.value.fechaVoucher),
            amarre: this.retornarInfo(this.detalleSelected.amarre || ''),
            importeDebeEquivalencia:
                parseFloat(this.actVCForm.value.debe2) || 0,
            importeHaberEquivalencia:
                parseFloat(this.actVCForm.value.haber2) || 0,
            transa: '', // Agregar este valor o usar uno existente
            orden: this.detalleSelected.orden,
            nroPago: this.actVCForm.value.numeroPago,
            fechaPago: this.formatFechaString(this.actVCForm.value.fechaPago),
            porcentaje: '', // Agregar este valor o usar uno existente
            docModTipo: this.actVCForm.value.tipoDocDocModifica,
            docModNumero: this.actVCForm.value.numeroDocModifica,
            docModFecha: this.actVCForm.value.fechaDocModifica,
        };

        console.log('Datos enviados: ', datosActualizar);

        this.regContableService.actualizarVoucher(datosActualizar).subscribe({
            next: (respuesta) => {
                this.messageService.add({
                    severity: 'sucess',
                    summary: 'Éxito',
                    detail: 'El voucher contable fue actualizado correctamente.',
                });
                console.log('Enviado correctamente: ', respuesta);
                this.mostrarDialogoExito = true;
                this.mensajeExito = 'Actualización exitosa';
                this.onClose.emit();
            },
            error: (err) => {
                console.error('Error al actualizar el voucher: ', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el voucher.',
                });
            },
        });
    }

    finalizarGuardado() {
        this.mostrarDialogoExito = true;
    }

    onConfirmOk() {
        this.mostrarDialogoExito = false;
        // Limpiamos y cerramos al confirmar el diálogo
        this.onClose.emit();
    }

    limpiarCampos() {
        this.actVCForm.reset();
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
        return new Date(dia, mes - 1, anio); // Retornamos un objeto Date (mes en base 0)
    }

    formatFechaString(fecha: Date | string | null): string | null {
        if (!fecha || (typeof fecha === 'string' && fecha.trim() === '')) {
            return '';
        }
        if (typeof fecha === 'string') return fecha;

        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    retornarInfo(value){
        if(value === null || value === undefined){
            return ''
        }
        return value
    }
}
