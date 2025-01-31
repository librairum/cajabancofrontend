import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cuenta_Bancaria, delCuenta_Bancaria, insertCuenta_Bancaria, updCuenta_Bancaria } from './Cuenta_Bancaria';
import { CuentaBancariaService } from '../../service/cuenta-bancaria.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MensajemodalComponent } from '../mensajemodal/mensajemodal.component';
import { ToastModule } from 'primeng/toast';
import { BancoService } from '../../service/banco.service';
import { Banco } from '../banco/Banco';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TooltipModule } from 'primeng/tooltip';
import {Router} from '@angular/router';
@Component({
    selector: 'app-cuenta-bancaria',
    standalone: true,
    imports: [CardModule,ButtonModule, TableModule, InputTextModule, DialogModule, ReactiveFormsModule, FormsModule,
        PanelModule, ConfirmDialogModule,
        CommonModule, ToastModule, DropdownModule, BreadcrumbModule,TooltipModule],
    templateUrl: './cuenta-bancaria.component.html',
    styleUrl: './cuenta-bancaria.component.css',
    providers: [MessageService, ConfirmationService]
})
export class CuentaBancariaComponent implements OnInit {

    //para listar en la tabla:
    Cuenta_BancariaList: Cuenta_Bancaria[] = [];
    //para ocultar en la tabla:
    ocultarColumna = false;
    //para la inserción de nuevo dato:
    CuentaBancariaForm: FormGroup;
    isEditing: boolean = false;
    isNew: boolean = false;
    insertCuenta_Bancaria: insertCuenta_Bancaria[] = [];

    //para editar:
    editingRowIndex: number | null = null;
    editingCuentaBancaria: Cuenta_Bancaria | null = null;
    isEditingAnyRow: boolean = false;
    //para actualizar:
    updCuenta_Bancaria: updCuenta_Bancaria[] = [];
    //eliminar
    delCuenta_Bancaria: delCuenta_Bancaria[] = [];

    //moneda:
    moneda: any[] = [];
    selectMoneda: string | null = null;
    // bancos
    bancos: Banco[] = [];
    selectedBancoId: string | null = null;
    //idBanco: string | null = null;

    items: any[] = [];
    //datos de BancoComponent:
    idBanco: string;
    descripcion: string;
    navigationData : any;

    constructor(private fb: FormBuilder, private cbS: CuentaBancariaService, 
        private messageService: MessageService, private confirmationsService: ConfirmationService, 
        private bS: BancoService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef,
        private bSc: BreadcrumbService, 
        private rout: Router) {
            const navigation = rout.getCurrentNavigation();
            if(navigation?.extras?.state){
                this.navigationData = navigation.extras.state;
            }else{
                //retorna a vista anterior
                this.rout.navigate(['Home/banco']);
            }

    }

    ngOnInit(): void {
        this.initForm();
        //traer datos del formulario de banco componente
        this.idBanco = this.navigationData.idBanco;
        this.descripcion = this.navigationData.descripcion;

        //codigo haylu
        //this.route.queryParams.subscribe(params => {
        //this.idBanco = params['idBanco'];
            //this.descripcion =params['descripcion'];
        //});
            
            console.log('idBanco:', this.idBanco);
            console.log('descripcion:', this.descripcion);
            
          if (this.idBanco && this.descripcion) {
            this.CuentaBancariaForm.patchValue({ idBanco: this.idBanco }); 
            this.CuentaBancariaForm.patchValue({descripcion: this.descripcion});
            this.loadCuentasBancarias();
            this.loadMonedas();
            this.bSc.setBreadcrumbs([
              { icon: 'pi pi-home', routerLink: '/' },
              { label: 'Banco', routerLink: '/Home/banco' },
              { label: 'Ver Cuentas' }
            ]);
            this.bSc.currentBreadcrumbs$.subscribe(bc => {
                this.items = bc;
            })
          }
        
      }
    initForm() {
        this.CuentaBancariaForm = this.fb.group({
            idCuenta: ['', Validators.required], //es lo que irá en el formControlName
            idBanco: [null],
            descripcion: [null],
            moneda: ['', Validators.required],
            ctaContable: [''],
            ctaITF: [''],
            pref: [''],
            ctaGastos: [''],
        });

    }
    // cargar las cuentas bancarias
    loadCuentasBancarias(): void {
        this.cbS.GetCuentasBancarias(this.idBanco)
            .subscribe({
                next: (data) => {
                    this.Cuenta_BancariaList = data;
                },
            });
        this.loadMonedas();
    }
    //para mostrar la nueva inserción:
    showAddRow() {
        this.isEditing = true;
        this.isNew = true;
        //this.CuentaBancariaForm.reset();
    }

    loadMonedas(): void {
        this.moneda = [
            { nombre: 'Dolares', id: 'D' },
            { nombre: 'Soles', id: 'S' }
        ];
    }
    onMonedaChange(event: any) {
        this.selectMoneda = event.value;
    }

    onBancoChange(event: any) {
        this.selectedBancoId = event.value;
    }
    //ACCIONES DELA TABLA:
    onRowEditInit(cuentaBancaria: Cuenta_Bancaria, index: number) {
        this.editingRowIndex = index;
        this.editingCuentaBancaria = { ...cuentaBancaria }
         
        this.isEditingAnyRow = true;
        console.log("verificacion datos: ", this.editingCuentaBancaria);

    }
    onRowEditCancel(index: number) {
        if (this.editingCuentaBancaria) {
            this.Cuenta_BancariaList[index] = { ...this.editingCuentaBancaria };
            this.editingCuentaBancaria = null;
            this.isEditingAnyRow = false;
            this.editingRowIndex = null;
        }
    }
    onRowEditSave(rowData: any) {
        if (rowData) {
            const updCuentaBancaria: updCuenta_Bancaria = {
                ban01Empresa: '01',
                ban01IdBanco: rowData.idBanco,
                ban01IdCuenta: rowData.idCuenta,
                ban01IdNro: rowData.id,
                ban01Moneda: rowData.moneda,
                ban01Descripcion: rowData.idBanco + ' ' + rowData.nombreBanco + ' ' + rowData.idCuenta,
                ban01CuentaContable: rowData.ctaContable,
                ban01Itf: rowData.ctaITF,
                ban01Prefijo: rowData.pref,
                ban01CtaDet: rowData.ctaGastos,
            };

            this.cbS.UpdateCuentaBancaria(updCuentaBancaria).subscribe({
                next: () => {
                    this.loadCuentasBancarias();
                    this.loadMonedas();
                    this.editingCuentaBancaria = null;
                    this.isEditingAnyRow = false;
                    this.editingRowIndex = null;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Registro actualizado',
                        life: 3000  
                    });
                
                    this.cdRef.detectChanges();
                }
            });
        }
    }
    onDelete(rowData: any, index: number) {
        if (rowData) {
            const idnro = rowData.id
            const idBanco = rowData.idBanco

            this.confirmationsService.confirm({
                message: `¿Está seguro que desea eliminar la cuenta bancaria?`,
                header: 'Confirmar Eliminación',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí, eliminar',
                rejectLabel: 'No, cancelar',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button',
                accept: () => {
                    this.cbS.DeleteCuentaBancaria(idBanco,idnro).subscribe({
                        next: () => {
                            this.Cuenta_BancariaList.splice(index, 1);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Registro eliminado',
                                life: 3000
                            });
                            this.loadCuentasBancarias();
                        }
                    });
                }
            });
        }
    }
    //botones para guardar del form:
    onCancel() {
        this.isEditing = false;
        this.isNew = false;
        this.CuentaBancariaForm.reset();
    }
    onSave() {
        if (this.CuentaBancariaForm.valid) {
            const formData = this.CuentaBancariaForm.value;

            const createCuentaBancaria: insertCuenta_Bancaria = {
                ban01Empresa: '01',
                ban01IdBanco:  this.idBanco,
                ban01IdCuenta: formData.idCuenta,
                ban01IdNro:  this.descripcion,
                ban01Moneda: formData.moneda,
                ban01Descripcion: this.idBanco + ' ' + this.descripcion + ' ' + formData.idCuenta,
                ban01CuentaContable: formData.ctaContable || '',
                ban01Itf: formData.ctaITF || '',
                ban01Prefijo: formData.pref || '',
                ban01CtaDet: formData.ctaGastos || '',

            };
            console.log("createCuentaBancaria: ", createCuentaBancaria);
            this.cbS.CreateCuentaBancaria(createCuentaBancaria).subscribe({
                next: () => {
                    this.loadMonedas();
                    this.isEditing = false;
                    this.isNew = false;
                    this.CuentaBancariaForm.reset();
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado', life: 3000 });
                    this.loadCuentasBancarias();
                    
                },
                error: (err) => {
                    console.error('Error al guardar:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro', life: 3000 });
                },
            });
        }
    }

}
