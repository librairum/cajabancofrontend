import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Banco } from './Banco';
import { BancoService } from '../../service/banco.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MensajemodalComponent } from "../mensajemodal/mensajemodal.component";
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';


@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, CardModule, InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule],
  templateUrl: './banco.component.html',
  styleUrl: './banco.component.css',
  providers:[MessageService,ConfirmationService]
})
export class BancoComponent implements OnInit {
    bancoForm:FormGroup;
    bancoList:Banco[]
    isEditing:boolean = false;
    editingRowIndex:number|null = null;
    editingBanco:Banco|null = null;
    editingRows: { [s: string]: boolean } = {};
    editingData:any={};
    displayDialog:boolean = false;
    isNew:boolean = false;
    clonedBancos:{[s:string]:Banco}={}
    items:any[] = [];
    isEditingAnyRow: boolean = false;

    constructor(private bancoService: BancoService, private fb:FormBuilder,private mS:MessageService,private confirmationService:ConfirmationService,private bS:BreadcrumbService){

    }


    ngOnInit():void {
        this.bS.setBreadcrumbs([
            {icon:'pi pi-home',routerLink: '/Home'},
            {label:'Bancos',routerLink:'/Home/banco'}
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.items=bc;
        })
        this.initForm()
        this.cargarBancos()
    }

    initForm(){
        this.bancoForm=this.fb.group({
            ban01Empresa: ['01', Validators.required],
            ban01IdBanco: ['', Validators.required],
            ban01Descripcion: ['', Validators.required],
            ban01Prefijo: ['', Validators.required]
        })
    }

    // cargar data
    cargarBancos():void{
        this.bancoService.GetBancos().subscribe({
            next:(data)=>this.bancoList=data,
            error: (error) => {
                this.mS.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al cargar bancos'
                });
              }
        });
    }
    //edicion
    onRowEditInit(banco:Banco):void{
        this.editingBanco={...banco}
        this.isEditingAnyRow=true;
    }
    onRowEditSave(banco:Banco):void{
        if(this.editingBanco){
            this.bancoService.ActualizarBanco(banco).subscribe({
                next:()=>{
                    this.editingBanco=null;
                    this.isEditingAnyRow=false;
                    this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado' });
                },
                error: () => {
                  this.mS.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
                }
            })
        }
    }
    onRowEditCancel(banco:Banco,index:number):void{
        if(this.editingBanco){
            this.bancoList[index]={...this.editingBanco};
            this.editingBanco=null;
            this.isEditingAnyRow=false;
            this.cargarBancos();
        }
    }
    //crear banco
    showAddRow(){
        this.isEditing=true;
        this.isNew=true;
        this.bancoForm.reset({ ban01Empresa: '01' });
    }
    onSave(){
        if(this.bancoForm.valid){
            const newBanco:Banco=this.bancoForm.value;
            this.bancoService.CrearBanco(newBanco).subscribe({
                next:()=>{
                    this.isEditing=false;
                    this.isNew=false;
                    this.bancoForm.reset();
                    this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado' });
                    this.cargarBancos();
                },
                error: (err) => {
                    console.error('Error al guardar:', err);
                    this.mS.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro' });
                },
            })
        }
    }

    onCancel(){
        this.isEditing=false;
        this.isNew=false;
        this.bancoForm.reset({ ban01Empresa: '01' });
    }

    onDelete(banco:Banco,index:number){
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar el año <b>${banco.ban01Descripcion}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'No, cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
            accept:()=>{
                this.bancoService.EliminarBanco(banco.ban01Empresa,banco.ban01IdBanco).subscribe({
                    next:()=>{
                        this.bancoList.splice(index,1);
                        this.mS.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Registro eliminado'
                        });
                        this.cargarBancos()
                    }
                })
            }
        })
    }
}
