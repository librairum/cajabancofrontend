import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { GlobalService } from 'src/app/demo/service/global.service';
import { PresupuestoService } from 'src/app/demo/service/presupuesto.service';
import {agregar_Pago, insert_detalle, proveedores_lista,} from '../../../model/presupuesto';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { calendario_traduccion } from 'src/app/shared/Calendarios';
import { InputTextModule } from 'primeng/inputtext';
import { verMensajeInformativo } from 'src/app/demo/components/utilities/funciones_utilitarias';
import { ConfigService } from 'src/app/demo/service/config.service';

@Component({
  selector: 'app-detraccion-individual-ayuda',
  standalone: true,
  imports: [  FormsModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        ToastModule,
        PanelModule,
        ConfirmDialogModule,
        TableModule,
        CommonModule,
        ButtonModule,
        RouterModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,],
  templateUrl: './detraccion-individual-ayuda.component.html',
  styleUrl: './detraccion-individual-ayuda.component.css',
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class DetraccionIndividualAyudaComponent implements OnInit {

  loading: boolean = false;
  ngOnInit(): void {

  }
}
