import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
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
import { MedioPago } from './mediopago';
import { MediopagoService } from '../../service/mediopago.service';
import { GlobalService } from '../../service/global.service';

@Component({
  selector: 'app-mediopago',
  standalone: true,
  templateUrl: './mediopago.component.html',
  styleUrl: './mediopago.component.css',
  imports: [
    ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, CardModule, 
    InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule
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

  constructor(
    private mediopagoService: MediopagoService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private gS: GlobalService,
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
      ban01Empresa: ['01', Validators.required],
      ban01IdTipoPago: ['', Validators.required],
      ban01Descripcion: ['', Validators.required],
      ban01AsiConPrefijo: ['', Validators.required],
      ban01AsiConCtaBanco: ['', Validators.required],
      ban01AsiConCtaITF: ['', Validators.required]
    });
  }

  cargarMediosPago(): void {
    const codigoEmpresa:string=this.gS.getCodigoEmpresa()
    this.mediopagoService.GetMediosPago(codigoEmpresa).subscribe({
      next: (data) => this.mediopagoList = data,
      error: () => {
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Error al cargar medios de pago' });
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
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
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
    this.mediopagoForm.reset({ ban01Empresa: '01' });
  }

  onSave() {
    if (this.mediopagoForm.valid) {
        
      const newMedioPago: MedioPago = this.mediopagoForm.value;
    //  console.log('Datos enviados al backend:', newMedioPago)
      this.mediopagoService.CrearMedioPago(newMedioPago).subscribe({
        next: () => {
          this.isEditing = false;
          this.isNew = false;
          this.mediopagoForm.reset();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado' });
          this.cargarMediosPago();
        },
        error: () => {
          //console.error(' Error en la petición DELETE:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro' });
        
        }
      });
    }
  }

  onCancel() {
    this.isEditing = false;
    this.isNew = false;
    this.mediopagoForm.reset({  ban01Empresa: '01' });
  }
  
  onDelete(mediopago: MedioPago, index: number): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el medio de pago <b>${mediopago.ban01Descripcion}</b>?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No, cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button',
      accept: () => {
        this.mediopagoService.EliminarMedioPago(mediopago.ban01Empresa, mediopago.ban01IdTipoPago).subscribe({
          next: () => {
            this.mediopagoList.splice(index, 1);
            this.messageService.add({ severity: 'success', 
                summary: 'Éxito', 
                detail: 'Registro eliminado' });
            this.cargarMediosPago();
          }
        });
      }
    });
  }
}
