
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

@Component({
    selector: 'app-consulta-doc-por-pago',
    standalone: true,
    templateUrl: './consulta-doc-por-pago.component.html',
    styleUrl: './consulta-doc-por-pago.component.css',
    imports: [
        ToastModule,
        TableModule,
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        PanelModule,
        BreadcrumbModule,
        ConfirmDialogModule,
        FormsModule,
    ],
    providers: [MessageService, ConfirmationService],
})
export class ConsultaDocPorPagoComponent implements OnInit {
    consultaDocPorPagoForm: FormGroup;
    consultaDocPorPagoList: ConsultaDocPorPago[] = [];
    isEditing: boolean = false;
    items: any[] = [];
    isNew: boolean = false;
    textoBuscar: string = '';

    constructor(
        private consultaDocPorPagoService: ConsultaDocPorPagoService,
        private fb: FormBuilder,
        private breadcrumbService: BreadcrumbService,
        private router: Router,
        private globalService: GlobalService,
        private messageService: MessageService,
        private presupuestoService: PresupuestoService
    ) {}

    ngOnInit(): void {
        this.breadcrumbService.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Home' },
            {
                label: 'Consulta doc. por pago',
                routerLink: '/Home/ConsultaDocPorPago',
            },
        ]);
        this.breadcrumbService.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });
        this.initForm();
        // No cargar datos automáticamente - solo cuando el usuario busque
    }

    buscar(): void {
        const filtro = this.textoBuscar.trim();
        
        if (filtro === '') {
            verMensajeInformativo(
                this.messageService,
                'warn',
                'Advertencia',
                'Debes escribir el ruc o el nro doc'
            );
            return;
        }
        
        this.listarconsultadocporpago();
    }

    initForm(): void {
        this.consultaDocPorPagoForm = this.fb.group({
            ban01Empresa: [
                this.globalService.getCodigoEmpresa(),
                Validators.required,
            ],
            ruc: ['', Validators.required],
            nombreEmpresa: ['', Validators.required],
            tipoDocumento: ['', Validators.required],
            nroDoc: ['', Validators.required],
            fechaDocumento: ['', Validators.required],
            moneda: ['', Validators.required],
            importeDocumento: ['', Validators.required],
            importePago: ['', Validators.required],
            fechaPago: ['', Validators.required],
        });
    }

    abrirdocumento(fechaPago: string, numeroPresupuesto: string): void {
        const fecha = fechaPago.split('/');
        const mesFecha = fecha[1];
        const anioFecha = fecha[2];

        this.presupuestoService
            .obtenerArchivo(
                this.globalService.getCodigoEmpresa(),
                anioFecha,
                mesFecha,
                numeroPresupuesto
            )
            .subscribe({
                next: (response: HttpResponse<Blob>) => {
                    const blob = response.body;
                    if (blob && blob.size > 0) {
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
                    verMensajeInformativo(
                        this.messageService,
                        'error',
                        'Error',
                        'Error al cargar el documento'
                    );
                },
            });
    }
    listarconsultadocporpago(): void {
        let filtro = this.textoBuscar.trim();

        if(filtro === ''){
            // No cargar nada si el filtro está vacío
            this.consultaDocPorPagoList = [];
            return;
        }
        
        this.consultaDocPorPagoService
            .GetConsultaDocPorPago(filtro)
            .subscribe({
                next: (data) => {
                    this.consultaDocPorPagoList = data;
                },
                error: () => {
                    verMensajeInformativo(
                        this.messageService,
                        'error',
                        'Error',
                        'Error al cargar documentos por pago'
                    );
                },
            });
    }
}
