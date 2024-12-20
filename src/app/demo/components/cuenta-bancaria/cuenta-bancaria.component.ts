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
import { ToastModule } from 'primeng/toast';
import { BancoService } from '../../service/banco.service';
import { Banco } from '../banco/Banco';
import { DropdownModule } from 'primeng/dropdown';
import { bs } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-cuenta-bancaria',
  standalone: true,
  imports: [ButtonModule, TableModule, InputTextModule, DialogModule,ReactiveFormsModule, FormsModule,
      PanelModule, ConfirmDialogModule, MensajemodalComponent,CommonModule,ToastModule,DropdownModule],
  templateUrl: './cuenta-bancaria.component.html',
  styleUrl: './cuenta-bancaria.component.css',
  providers:[MessageService]
})
export class CuentaBancariaComponent implements OnInit {
    cuentaBancariaForm_paso1:FormGroup;
    cuentaBancariaForm_paso2:FormGroup;
    cuentasBancarias: Cuenta_Bancaria[]=[];
    originalcuentas:Cuenta_Bancaria[] = [];
    isLoading:boolean = false;
    errorMessage: string = '';

    // Modal para controlar las variables
    displayModal_paso1: boolean=false;
    displayModal_paso2: boolean=false;
    displayConfirmDeleteModal: boolean=false;
    currentCuentaBancaria:Cuenta_Bancaria | null=null;

    //eliminar
    deleteCuenta:Cuenta_Bancaria | null=null;

    mostrarMensajeModal: boolean=false;
    mensajemodal: string='';

    // bancos
    bancos:Banco[]
    selectedBancoId: string | null=null;
    banco:string[]=[];

    constructor(private fb:FormBuilder, private cbS:CuentaBancariaService, private messageService:MessageService,private bS:BancoService){

    }

    ngOnInit(): void {
        this.initForm_paso1();
        this.initiForm_paso2();
        this.loadCuentasBancarias();
        this.loadBancos()
    }


    initForm_paso1(): void{
        this.cuentaBancariaForm_paso1=this.fb.group({
            ban01Empresa: ['', [Validators.required]],
            ban01IdBanco: ['', [Validators.required]],
            ban01IdCuenta: ['', [Validators.required]]
        });
    }


    initiForm_paso2(): void{
        this.cuentaBancariaForm_paso2=this.fb.group({
            ban01IdNro: [''],
            ban01Moneda: [''],
            ban01Descripcion: [''],
            ban01CuentaContable: [''],
            ban01Itf: [''],
            ban01Prefijo: [''],
            ban01CtaDet: ['']
        })
    }

    // cargar las cuentas bancarias
    loadCuentasBancarias():void{
        this.isLoading=true;
        this.cbS.GetCuentasBancarias().subscribe(
            (data: Cuenta_Bancaria[])=>{
                this.cuentasBancarias=data;
                this.originalcuentas=[...data];
                this.isLoading=false;
            },
            (error)=>{
                this.errorMessage='Error al cargar las cuentas bancarias';
                this.mostrarMensaje('Error al cargar las cuentas bancarias');
                this.isLoading=false;
            }
        )
    }
    // abrimos el modal para registra una nueva cuenta
    showAddModal(): void {
        /*if (!this.displayModal_paso1 && this.displayModal_paso2  && !this.displayConfirmDeleteModal) {


        }*/
        this.displayModal_paso1 = true; // Mostrar el modal paso 1
        this.currentCuentaBancaria = null; // Resetear datos
        this.cuentaBancariaForm_paso1.reset(); // Limpiar el formulario paso 1
        this.cuentaBancariaForm_paso2.reset();
    }

    loadBancos(){
        this.bS.ComboboxBancos().subscribe(
            (data: Banco[]) =>{
                this.bancos=data;
            }
        )
    }

    onBancoChange(event: any){
        const selectedBancoId=event.value;
    }



    continuepaso2(): void{
        if(this.cuentaBancariaForm_paso1.valid){
            this.displayModal_paso1=false;
            this.displayModal_paso2=true;
        } else {
            /*this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete los campos requeridos en el paso 1.'
            });*/
            this.mostrarMensaje('Por favor complete los campos requeridos en el paso 1.');
        }
    }


    // abrimos el modal para el editar cuenta bancaria
    showEditModal(cuenta: Cuenta_Bancaria): void {
          this.currentCuentaBancaria = { ...cuenta };
          this.cuentaBancariaForm_paso2.patchValue(this.currentCuentaBancaria);
          this.cuentaBancariaForm_paso1.patchValue({
            ban01Empresa: this.currentCuentaBancaria.ban01Empresa,
            ban01IdBanco:this.currentCuentaBancaria.ban01IdBanco,
            ban01IdCuenta:this.currentCuentaBancaria.ban01IdCuenta
          })
          this.displayModal_paso2 = true;
    }

    guardar(): void {
        if (this.cuentaBancariaForm_paso2.invalid) {
            /*this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete todos los campos requeridos en el paso 2.'
            });*/
            this.mostrarMensaje('Por favor complete todos los campos requeridos en el paso 2.');
            return;
        }

        const cuentaBancariaData = {
            ...this.cuentaBancariaForm_paso1.value, // Copiamos los valores del paso 1
            ...this.cuentaBancariaForm_paso2.value, // Copiamos los valores del paso 2

        };

        if (this.currentCuentaBancaria) {
            // Editar cuenta
            this.cbS.UpdateCuentaBancaria(
                this.currentCuentaBancaria.ban01Empresa,
                this.currentCuentaBancaria.ban01IdBanco,
                this.currentCuentaBancaria.ban01IdCuenta,
                cuentaBancariaData
            ).subscribe(
                () => {
                    /*this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Cuenta bancaria actualizada correctamente'
                    });*/
                    this.mostrarMensaje('Cuenta bancaria actualizada correctamente');
                    this.displayModal_paso2 = false; // Cerrar el modal del paso 2
                    this.loadCuentasBancarias(); // Recargar las cuentas bancarias
                },
                (error) => {
                    /*this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar la cuenta bancaria'
                    });*/
                    this.mostrarMensaje('Error al actualizar la cuenta bancaria');
                    console.error('Error response:', error); // Muestra el error en consola
                }
            );
        } else {
            // Crear nueva cuenta
            this.cuentaBancariaForm_paso2.reset();
            this.cbS.CreateCuentaBancaria(cuentaBancariaData).subscribe(
                () => {
                    /*this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Cuenta bancaria creada correctamente'
                    });*/
                    this.mostrarMensaje('Cuenta bancaria creada correctamente');
                    this.displayModal_paso2 = false; // Cerrar el modal del paso 2
                    this.loadCuentasBancarias(); // Recargar las cuentas bancarias
                },
                (error) => {
                    /*this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al crear la cuenta bancaria'
                    });*/
                    this.mostrarMensaje('Cuenta bancaria creada correctamente');
                    console.error('Error response:', error); // Muestra el error en consola
                }
            );
        }
    }



    cancelRegister(): void {
        this.displayModal_paso1 = false;
        this.displayModal_paso2 = false;
    }

    // para el eliminar cuenta bancaria
    // Método para abrir el diálogo de confirmación
    // Confirmar la eliminación de la cuenta
    confirmDelete(cuenta: Cuenta_Bancaria): void {
        if (!this.displayModal_paso1 && !this.displayModal_paso2 && !this.displayConfirmDeleteModal) { // Validar que no haya otros modales abiertos
            this.deleteCuenta = cuenta;
            this.messageService.clear(); // Limpiar mensajes previos
            console.log('Deleting Cuenta:', this.deleteCuenta);
            this.displayConfirmDeleteModal = true; // Abrir el modal de confirmación

            this.messageService.add({
                key: 'confirmDialog',
                sticky: true,
                severity: 'warn',
                summary: 'Confirmación requerida',
                detail: `¿Está seguro que desea eliminar la cuenta bancaria nro ${cuenta.ban01IdCuenta}?`
            });
        }
    }

    // Método para manejar la confirmación positiva
    onDeleteConfirmed(): void {
        this.displayConfirmDeleteModal=false;
        if (this.deleteCuenta) {
            console.log('Deleting Cuenta:', this.deleteCuenta); // Agregar el console.log
            this.cbS.DeleteCuentaBancaria(
                this.deleteCuenta.ban01Empresa,
                this.deleteCuenta.ban01IdBanco,
                this.deleteCuenta.ban01IdCuenta
            ).subscribe(
                () => {
                    /*this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cuenta bancaria eliminada correctamente' });*/
                    this.mostrarMensaje('Cuenta bancaria eliminada correctamente');
                    this.loadCuentasBancarias(); // Recargar datos
                },
                (error) => {
                    /*this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la cuenta bancaria' });*/
                    this.mostrarMensaje('No se pudo eliminar la cuenta bancaria');
                }
            );
        }
        this.deleteCuenta = null; // Resetear la cuenta
        //this.messageService.clear('confirmDialog'); // Cerrar diálogo
    }


    // Método para cancelar la confirmación
    onDeleteCancelled(): void {
        this.deleteCuenta = null; // Resetear la cuenta
        this.messageService.clear('confirmDialog'); // Cerrar diálogo
    }


    onSearch(query: string) {
        const searchTerm = query.toLowerCase().trim(); // Convertir a minúsculas y eliminar espacios en blanco
        if (searchTerm) {
            this.cuentasBancarias = this.originalcuentas.filter(b => {
                const empresa = b.ban01Empresa.toLowerCase();
                const banco = b.ban01IdBanco.toLowerCase();
                const cuenta = b.ban01IdCuenta.toLowerCase();
                const descripcion = b.ban01Descripcion.toLowerCase();
                return empresa.includes(searchTerm) || banco.includes(searchTerm) || cuenta.includes(searchTerm) || descripcion.includes(searchTerm);
            });
        } else {
            this.cuentasBancarias = [...this.originalcuentas]; // Restablecer la lista completa si el campo está vacío
        }
    }


    mostrarMensaje(mensaje: string){
        this.mensajemodal=mensaje;
        this.mostrarMensajeModal=true;
    }

    cerrarModalMensaje(){
        this.mostrarMensajeModal=false;
    }






}
