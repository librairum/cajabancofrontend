import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MedioPago } from '../../model/mediopago';
import { MediopagoService } from '../../service/mediopago.service';
import { GlobalService } from '../../service/global.service';
import { verMensajeInformativo } from '../utilities/funciones_utilitarias';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-mediopago',
  standalone: true,
  templateUrl: './mediopago.component.html',
  styleUrl: './mediopago.component.css',
  imports: [
    ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, CardModule,
    InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule, DropdownModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class MediopagoComponent implements OnInit {
  mediopagoForm: FormGroup;
  mediopagoList: MedioPago[] = [];
  isEditing: boolean = false;
  editingMedioPago: MedioPago | null = null;
  isEditingAnyRow: boolean = false;
  items: any[] = [];
  isNew: boolean = false;
  rowsPerPage: number = 10; // Numero de filas por página

  constructor(
    private mediopagoService: MediopagoService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { icon: 'pi pi-home', routerLink: '/Home' },
      { label: 'Medios de Pago', routerLink: '/Home/medio_pago' }
    ]);
    this.breadcrumbService.currentBreadcrumbs$.subscribe(bc => {
      this.items = bc;
    });
    this.initForm();
    this.cargarMediosPago();
  }

  initForm(): void {
    this.mediopagoForm = this.fb.group({
        ban01Empresa: [
            this.globalService.getCodigoEmpresa(),
            Validators.required,
        ],
        ban01IdTipoPago: ['', Validators.required],
        ban01Descripcion: ['', Validators.required],
        ban01AsiConPrefijo: ['', Validators.required],
        ban01AsiConCtaBanco: ['', Validators.required],
        ban01AsiConCtaITF: ['', Validators.required],
    });
  }

  cargarMediosPago(): void {
    const codigoEmpresa:string=this.globalService.getCodigoEmpresa()
    this.mediopagoService.GetMediosPago(codigoEmpresa).subscribe({
      next: (data) => this.mediopagoList = data,
      error: () => {
            verMensajeInformativo(this.messageService,'error', 'Error', 'Error al cargar medios de pago');
      }
    });
  }


  onRowEditInit(mediopago: MedioPago): void {
    this.editingMedioPago = { ...mediopago };
    this.isEditingAnyRow = true;
  }

  onRowEditSave(mediopago: MedioPago): void {
    if (this.editingMedioPago) {
      this.mediopagoService.ActualizarMedioPago(mediopago).subscribe({
        next: () => {
          this.editingMedioPago = null;
          this.isEditingAnyRow = false;
          verMensajeInformativo(this.messageService,'success', 'Éxito', 'Registro actualizado');
        },
        error: () => {
          verMensajeInformativo(this.messageService,'error', 'Error', 'Error al actualizar');
        }
      });
    }
  }

  onRowEditCancel(mediopago:MedioPago,index: number): void {
    if (this.editingMedioPago) {
      this.mediopagoList[index] = { ...this.editingMedioPago };
      this.editingMedioPago = null;
      this.isEditingAnyRow = false;
      this.cargarMediosPago();
    }
  }

  showAddRow(){
    this.isEditing = true;
    this.isNew = true;
    this.mediopagoForm.reset({
        ban01Empresa: this.globalService.getCodigoEmpresa(),
    });
  }

  onSave() {
    if (this.mediopagoForm.valid) {
      const newMedioPago: MedioPago = this.mediopagoForm.value;
      this.mediopagoService.CrearMedioPago(newMedioPago).subscribe({
        next: (response) => {
          if (response.messageException) {
            verMensajeInformativo(this.messageService, 'error', 'Error', 'Código existente, verifica las filas');
          } else {
            this.isEditing = false;
            this.isNew = false;
            this.mediopagoForm.reset();
            verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro guardado');
            this.cargarMediosPago();
          }
        },
        error: () => {
          verMensajeInformativo(this.messageService, 'error', 'Error', 'No se pudo guardar el registro');
        }
      });
    }
  }

  onCancel() {
    this.isEditing = false;
    this.isNew = false;
    this.mediopagoForm.reset({
        ban01Empresa: this.globalService.getCodigoEmpresa(),
    });
  }

  onDelete(mediopago: MedioPago, index: number): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el medio de pago <b>${mediopago.ban01Descripcion}</b>?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',
      accept: () => {
        this.mediopagoService.EliminarMedioPago(mediopago.ban01Empresa, mediopago.ban01IdTipoPago).subscribe({
          next: () => {
            this.mediopagoList.splice(index, 1);
            verMensajeInformativo(this.messageService,'success', 'Éxito', 'Registro eliminado');
            this.cargarMediosPago();
          }
        });
      }
    });
  }
}
