import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cuenta_Bancaria } from './Cuenta_Bancaria';
import { CuentaBancariaService } from '../../service/cuenta-bancaria.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MensajemodalComponent } from '../mensajemodal/mensajemodal.component';

@Component({
  selector: 'app-cuenta-bancaria',
  standalone: true,
  imports: [ButtonModule, TableModule, InputTextModule, DialogModule,ReactiveFormsModule, FormsModule,
      PanelModule, ConfirmDialogModule, MensajemodalComponent,CommonModule],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrl: './cuenta-bancaria.component.css',
  providers:[MessageService]
})
export class CuentaBancariaComponent implements OnInit {
    cuentaBancariaForm:FormGroup;
    cuentasBancarias: Cuenta_Bancaria[]=[];
    isLoading:boolean = false;
    errorMessage: string = '';

    // Modal para controlar las variables
    displayModal: boolean=false;
    displayEditModal: boolean=false;
    currentCuentaBancaria:Cuenta_Bancaria | null=null;

    //eliminar
    deleteCuenta:Cuenta_Bancaria | null=null;

    constructor(private fb:FormBuilder, private cbS:CuentaBancariaService, private messageService:MessageService){

    }

    ngOnInit(): void {
        this.initForm();
        this.loadCuentasBancarias();
    }

    initForm(): void{
        this.cuentaBancariaForm=this.fb.group({
            ban01Empresa: ['', [Validators.required]],
            ban01IdBanco: ['', [Validators.required]],
            ban01IdCuenta: ['', [Validators.required]],
            ban01Nro: [''],
            ban01Moneda: [''],
            ban01Descripcion: [''],
            ban01CuentaContable: [''],
            ban01Itf: [''],
            ban01Prefijo: [''],
            ban01CtaDet: ['']
        });
    }

    // cargar las cuentas bancarias
    loadCuentasBancarias():void{
        this.isLoading=true;
        this.cbS.GetCuentasBancarias().subscribe(
            (data: Cuenta_Bancaria[])=>{
                this.cuentasBancarias=data;
                this.isLoading=false;
            },
            (error)=>{
                this.errorMessage='Error al cargar las cuentas bancarias';
                this.isLoading=false;
            }
        )
    }
    // abrimos el modal para registra una nueva cuenta
    showAddModal():void{
        this.currentCuentaBancaria=null;
        this.cuentaBancariaForm.reset();
        this.displayModal=true;
    }

    // abrimos el modal para el editar cuenta bancaria
    showEditModal(cuenta:Cuenta_Bancaria): void{
        this.currentCuentaBancaria={...cuenta};
        this.cuentaBancariaForm.patchValue(this.currentCuentaBancaria);
        this.displayEditModal=true;
    }

    guardar():void{
        if(this.cuentaBancariaForm.invalid){
            return;
        }

        const cuentaBancariaData=this.cuentaBancariaForm.value;

        if(this.currentCuentaBancaria){
            // para el editar
            this.cbS.UpdateCuentaBancaria(this.currentCuentaBancaria.ban01Empresa,this.currentCuentaBancaria.ban01IdBanco,this.currentCuentaBancaria.ban01IdCuenta,cuentaBancariaData).subscribe(
                ()=>{
                    this.messageService.add({severity:'success',summary: 'Exito',detail:'Cuenta bancaria actualizada correctamente'});
                    this.displayEditModal=false;
                    this.loadCuentasBancarias();
                },
                (error)=>{
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la cuenta bancaria' });
                }
            );
        } else {
            // para crear
            this.cbS.CreateCuentaBancaria(cuentaBancariaData).subscribe(
                ()=>{
                    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Cuenta bancaria creada correctamente' });
                    this.displayModal = false;
                    this.loadCuentasBancarias();
                },
                (error)=>{
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la cuenta bancaria' });
                }
            )
        }
    }

    // para el eliminar cuenta bancaria
    // Método para abrir el diálogo de confirmación
    confirmDelete(cuenta: Cuenta_Bancaria): void {
        this.deleteCuenta = cuenta; // Asignar la cuenta a eliminar
        this.messageService.clear(); // Limpiar mensajes previos
        this.messageService.add({
        key: 'confirmDialog',
        sticky: true,
        severity: 'warn',
        summary: 'Confirmación requerida',
        detail: `¿Está seguro que desea eliminar la cuenta bancaria con ID: ${cuenta.ban01IdCuenta}?`
        });
    }

    // Método para manejar la confirmación positiva
    onDeleteConfirmed(): void {
        if (this.deleteCuenta) {
        this.cbS.DeleteCuentaBancaria(
            this.deleteCuenta.ban01Empresa,
            this.deleteCuenta.ban01IdBanco,
            this.deleteCuenta.ban01IdCuenta
        ).subscribe(
            () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cuenta bancaria eliminada correctamente' });
            this.loadCuentasBancarias(); // Recargar datos
            },
            (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la cuenta bancaria' });
            }
        );
        }
        this.deleteCuenta = null; // Resetear la cuenta
        this.messageService.clear('confirmDialog'); // Cerrar diálogo
    }

    // Método para cancelar la confirmación
    onDeleteCancelled(): void {
        this.deleteCuenta = null; // Resetear la cuenta
        this.messageService.clear('confirmDialog'); // Cerrar diálogo
    }




}
