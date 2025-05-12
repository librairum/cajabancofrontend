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

monedasOptions: any[] = [
    { label: 'Soles', value: 'S' },
    { label: 'Dólares', value: 'D' }
  ];

  flagITFOptions: any[] = [
    { label: 'Si', value: 'S' },
    { label: 'No', value: 'N' }
  ];

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
        ban01Descripcion: ['', ],
         ban01AsiConPrefijo: [''], // Elimina el validador required
      ban01AsiConCtaBanco: [''], // Elimina el validador required
      ban01AsiConCtaITF: [''], // Elimina el validador required
      ban01AsiConDiario: [''], // Elimina el validador required
      ban01Moneda: [''], // Valor por defecto sin validador required
      ban01AsiConCtaComiOtrosBancos: [''], // Elimina el validador required
      ban01AsiConFlagITF: [''], // Valor por defecto sin validador required
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
  // Verificamos que solo el campo de código esté completo
  const idTipoPago = this.mediopagoForm.get('ban01IdTipoPago')?.value;

  if (!idTipoPago) {
    verMensajeInformativo(this.messageService, 'error', 'Error', 'El Código es un campo obligatorio');
    return;
  }

  // Si el campo obligatorio está completo, procedemos a guardar
  const newMedioPago: MedioPago = this.mediopagoForm.value;

  // Aseguramos que los campos opcionales vacíos se envíen como cadenas vacías
  newMedioPago.ban01Descripcion = newMedioPago.ban01Descripcion || ''; // Ahora descripción es opcional
  newMedioPago.ban01AsiConPrefijo = newMedioPago.ban01AsiConPrefijo || '';
  newMedioPago.ban01AsiConCtaBanco = newMedioPago.ban01AsiConCtaBanco || '';
  newMedioPago.ban01AsiConCtaITF = newMedioPago.ban01AsiConCtaITF || '';
  newMedioPago.ban01AsiConDiario = newMedioPago.ban01AsiConDiario || '';
  newMedioPago.ban01AsiConCtaComiOtrosBancos = newMedioPago.ban01AsiConCtaComiOtrosBancos || '';

  // Para los dropdowns aseguramos valores por defecto si están vacíos
  newMedioPago.ban01Moneda = newMedioPago.ban01Moneda || 'S';
  newMedioPago.ban01AsiConFlagITF = newMedioPago.ban01AsiConFlagITF || 'N';

  this.mediopagoService.CrearMedioPago(newMedioPago).subscribe({
    next: (response) => {
      if (response.messageException) {
        verMensajeInformativo(this.messageService, 'error', 'Error', 'Código existente, verifica las filas');
      } else {
        this.isEditing = false;
        this.isNew = false;
        this.mediopagoForm.reset({
            ban01Empresa: this.globalService.getCodigoEmpresa(),
        });
        verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro guardado');
        this.cargarMediosPago();
      }
    },
    error: () => {
      verMensajeInformativo(this.messageService, 'error', 'Error', 'No se pudo guardar el registro');
    }
  });
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
        // Verificamos que tengamos todos los datos necesarios para la eliminación
        if (!mediopago.ban01Empresa || !mediopago.ban01IdTipoPago) {
          console.error('Error: Datos incompletos para eliminar', mediopago);
          verMensajeInformativo(this.messageService, 'error', 'Error',
            'No se puede eliminar: datos incompletos del registro');
          return;
        }

        this.mediopagoService.EliminarMedioPago(mediopago.ban01Empresa, mediopago.ban01IdTipoPago).subscribe({
          next: (response) => {
            // Encontrar el índice exacto en el array por ID para asegurar que eliminamos el correcto
            const indexToRemove = this.mediopagoList.findIndex(item =>
              item.ban01IdTipoPago === mediopago.ban01IdTipoPago &&
              item.ban01Empresa === mediopago.ban01Empresa
            );

            if (indexToRemove !== -1) {
              this.mediopagoList.splice(indexToRemove, 1);
            }

            verMensajeInformativo(this.messageService, 'success', 'Éxito', 'Registro eliminado');

            // Recargar la lista completa para asegurar sincronización con el servidor
            this.cargarMediosPago();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            verMensajeInformativo(this.messageService, 'error', 'Error',
              'No se pudo eliminar el registro. Por favor, intente nuevamente.');
          }
        });
      }
    });
  }

}