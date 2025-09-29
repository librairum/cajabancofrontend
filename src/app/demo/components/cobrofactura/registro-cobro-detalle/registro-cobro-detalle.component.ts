import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';
import { GlobalService } from 'src/app/demo/service/global.service';
import { CobroFacturaService } from 'src/app/demo/service/cobrofactura.service';

interface FacturaDetalle {
  numero: string;
  fecha: Date;
  moneda: string;
  importeOriginal: number;
  importePagado: number;
}

interface SustentoAdjunto {
  nombreArchivo: string;
  descripcion: string;
}

@Component({
  selector: 'app-registro-cobro-detalle',
  standalone: true,
  imports: [
    BreadcrumbModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    PanelModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DialogModule,
  ],
  templateUrl: './registro-cobro-detalle.component.html',
  styleUrl: './registro-cobro-detalle.component.css',
  providers: [ConfirmationService, MessageService, DatePipe],
})
export class RegistroCobroDetalleComponent implements OnInit {
  navigationData: any;
  items: any[] = [];
  
  // Campos de formulario
  cobroNro: string = '';
  fecha: Date;
  cliente: string = '';
  
  // Tablas
  facturasAfectadas: FacturaDetalle[] = [];
  sustentosAdjuntos: SustentoAdjunto[] = [];
  
  load: boolean = false;
  
  // Edición
  editingFactura: FacturaDetalle | null = null;
  editingSustento: SustentoAdjunto | null = null;
  isAnyRowEditing: boolean = false;

  constructor(
    private messageService: MessageService,
    private bs: BreadcrumbService,
    private router: Router,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private globalService: GlobalService,
    private cobroService: CobroFacturaService
  ) {
    const navigation = router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.navigationData = navigation.extras.state;
    } else {
      this.router.navigate(['Home/registro-cobro']);
    }
  }

  ngOnInit(): void {
    this.bs.setBreadcrumbs([
      { icon: 'pi pi-home', routerLink: '/Home' },
      {
        label: 'Registro de Cobro',
        routerLink: '/Home/registro_cobro',
      },
      {
        label: 'Detalle',
        routerLink: '/Home/registro_cobro_detalle',
      },
    ]);
    
    this.bs.currentBreadcrumbs$.subscribe((bc) => {
      this.items = bc;
    });
    
    this.cargarDetalles();
    this.valoresCampos();
  }

  cargarDetalles() {
    this.load = true;
    
    // Datos de ejemplo - reemplaza con tu servicio
    this.facturasAfectadas = [
      {
        numero: 'F001-2040',
        fecha: new Date('2025-10-09'),
        moneda: 'Soles',
        importeOriginal: 22100.00,
        importePagado: 22100.00
      },
      {
        numero: 'F001-2041',
        fecha: new Date('2025-12-09'),
        moneda: 'Soles',
        importeOriginal: 40000.00,
        importePagado: 12300.00
      }
    ];
    
    this.sustentosAdjuntos = [
      { nombreArchivo: 'deposito.pdf', descripcion: 'Deposito' },
      { nombreArchivo: 'Correo de pago.pdf', descripcion: 'Correo' },
      { nombreArchivo: '1503461.pdf', descripcion: 'doc de pago sani' }
    ];
    
    this.load = false;
  }

  valoresCampos() {
    this.cobroNro = this.navigationData?.CobroNro || '';
    this.cliente = this.navigationData?.Cliente || '';
    
    const fechaString = this.navigationData?.Fecha;
    if (fechaString) {
      const [day, month, year] = fechaString.split('/').map(Number);
      this.fecha = new Date(year, month - 1, day);
    } else {
      this.fecha = new Date();
    }
  }

  // Métodos para tabla Facturas Afectadas
  startEditingFactura(factura: FacturaDetalle) {
    if (this.isAnyRowEditing) return;
    this.editingFactura = { ...factura };
    this.isAnyRowEditing = true;
  }

  saveEditingFactura() {
    if (this.editingFactura) {
      const index = this.facturasAfectadas.findIndex(
        f => f.numero === this.editingFactura.numero
      );
      if (index !== -1) {
        this.facturasAfectadas[index] = { ...this.editingFactura };
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Factura actualizada correctamente'
        });
      }
      this.cancelEditingFactura();
    }
  }

  cancelEditingFactura() {
    this.editingFactura = null;
    this.isAnyRowEditing = false;
  }

  eliminarFactura(factura: FacturaDetalle) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la factura ${factura.numero}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.facturasAfectadas = this.facturasAfectadas.filter(
          f => f.numero !== factura.numero
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Factura eliminada correctamente'
        });
      }
    });
  }

  // Métodos para tabla Sustentos Adjuntos
  startEditingSustento(sustento: SustentoAdjunto) {
    if (this.isAnyRowEditing) return;
    this.editingSustento = { ...sustento };
    this.isAnyRowEditing = true;
  }

  saveEditingSustento() {
    if (this.editingSustento) {
      const index = this.sustentosAdjuntos.findIndex(
        s => s.nombreArchivo === this.editingSustento.nombreArchivo
      );
      if (index !== -1) {
        this.sustentosAdjuntos[index] = { ...this.editingSustento };
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sustento actualizado correctamente'
        });
      }
      this.cancelEditingSustento();
    }
  }

  cancelEditingSustento() {
    this.editingSustento = null;
    this.isAnyRowEditing = false;
  }

  eliminarSustento(sustento: SustentoAdjunto) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el archivo ${sustento.nombreArchivo}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.sustentosAdjuntos = this.sustentosAdjuntos.filter(
          s => s.nombreArchivo !== sustento.nombreArchivo
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Sustento eliminado correctamente'
        });
      }
    });
  }

  // Métodos de utilidad
  getTotalFacturas(field: keyof FacturaDetalle): number {
    return this.facturasAfectadas.reduce(
      (sum, item) => sum + (Number(item[field]) || 0),
      0
    );
  }
  agregarNuevaFactura() {
  // TODO: Implementar funcionalidad
  console.log('Agregar nueva factura');
}

agregarNuevoSustento() {
  // TODO: Implementar funcionalidad
  console.log('Agregar nuevo sustento');
}
}