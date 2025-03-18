import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
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
import { Router} from  '@angular/router';
import { MedioPago } from './mediopago';
import { MediopagoService } from '../../service/mediopago.service';
@Component({
  selector: 'app-mediopago',
  standalone: true,
  templateUrl: './mediopago.component.html',
  styleUrl: './mediopago.component.css',
  imports: [ToastModule, TableModule, ReactiveFormsModule, CommonModule, ButtonModule, CardModule, InputTextModule, PanelModule, BreadcrumbModule, ConfirmDialogModule, FormsModule],
  providers:[MessageService,ConfirmationService]
})
export class MediopagoComponent implements OnInit{
      mediopagoForm:FormGroup;
      mediopagoList:MedioPago[]
      isEditing:boolean = false;
      editingRowIndex:number|null = null;
      editingMedioPago:MedioPago|null = null;
      editingRows: { [s: string]: boolean } = {};
      editingData:any={};
      displayDialog:boolean = false;
      isNew:boolean = false;
      clonedMedioPago:{[s:string]:MedioPago}={}
      items:any[] = [];
      isEditingAnyRow: boolean = false;
  
      constructor(private mediopagoService: MediopagoService, private fb:FormBuilder,
          private mS:MessageService,private confirmationService:ConfirmationService,
          private bS:BreadcrumbService, private router: Router){
  
      }
  
  
      ngOnInit():void {
          this.bS.setBreadcrumbs([
              {icon:'pi pi-home',routerLink: '/Home'},
              {label:'MediosPago',routerLink:'/Home/medio_pago'}
          ]);
          this.bS.currentBreadcrumbs$.subscribe(bc=>{
              this.items=bc;
          })
          this.initForm()
          this.cargarMediosPago()
      }
   // Función para navegar a las cuentas del banco seleccionado
    verPagos(mediopago): void {
      // Primero, actualiza las migas de pan antes de navegar
      this.bS.setBreadcrumbs([
        { icon: 'pi pi-home', routerLink: '/' },
        { label: 'MediosPago', routerLink: '/Home/mediopago' },
        { label: 'Ver Pagos' }
      ]);
      this.bS.currentBreadcrumbs$.subscribe(bp => {
        this.items = bp;
      })
      const navigationExtras = {
          state:{
             idMedioPago: mediopago.ban01IdTipoPago,
              descripcion:mediopago.ban01descripcion,
              asiconprefijo:mediopago.ban01AsiConPrefijo,
              conctabanco:mediopago.ban01ConCtaBanco,
              asiconctaITF:mediopago.ban01AsiConCtaITF

          }
      }
      this.router.navigate(['Home/cuentas_pago'], navigationExtras);
      /*
      this.router.navigate(['/Home/banco/cuentas'], {
        queryParams: {
          idBanco: banco.ban01IdBanco,
          descripcion: banco.ban01Descripcion
        }
      });
      */
      // Luego, navega a la ruta correspondiente de "Ver Cuentas"
      //this.router.navigate([`/Home/banco/${banco.ban01IdBanco}/cuentas/${banco.ban01Descripcion}`]);
    }
      initForm(){
          this.mediopagoForm=this.fb.group({
            ban01IdTipoPago: ['01', Validators.required],
            ban01descripcion: ['', Validators.required],
            ban01AsiConPrefijo: ['', Validators.required],
            ban01ConCtaBanco: ['', Validators.required],
            ban01AsiConCtaITF: ['', Validators.required]
          })
      }
  
      // cargar data
      cargarMediosPago():void{
          this.mediopagoService.GetMediosPago().subscribe({
              next:(data)=>this.mediopagoList=data,
              error: (error) => {
                  this.mS.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar medios pago'
                  });
                }
          });
      }
      //edicion
      onRowEditInit(mediopago:MedioPago):void{
          this.editingMedioPago={...mediopago}
          this.isEditingAnyRow=true;
      }
      /*onRowEditSave(mediopago:MedioPago):void{
          if(this.editingMedioPago){
              this.mediopagoService.ActualizarMedioPago(mediopago).subscribe({
                  next:()=>{
                      this.editingMedioPago=null;
                      this.isEditingAnyRow=false;
                      this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado' });
                  },
                  error: () => {
                    this.mS.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
                  }
              })
          }
      }*/
          onRowEditSave(mediopago: MedioPago): void {
            console.log('Intentando guardar:', mediopago); // Verifica los datos
            if (mediopago) {
                this.mediopagoService.ActualizarMedioPago(mediopago).subscribe({
                    next: () => {
                        this.editingMedioPago = null;
                        this.isEditingAnyRow = false;
                        this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado' });
                        this.cargarMediosPago(); // Refresca la tabla después de guardar
                    },
                    error: () => {
                        this.mS.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
                    }
                });
            } else {
                this.mS.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay datos para guardar' });
            }
        }
        
      onRowEditCancel(mediopago:MedioPago,index:number):void{
          if(this.editingMedioPago){
              this.mediopagoList[index]={...this.editingMedioPago};
              this.editingMedioPago=null;
              this.isEditingAnyRow=false;
              this.cargarMediosPago();
          }
      }
      //crear banco
      showAddRow(){
          this.isEditing=true;
          this.isNew=true;
          this.mediopagoForm.reset({ ban01IdTipoPago: '01' });
      }
      onSave(){
          if(this.mediopagoForm.valid){
              const newMediopago:MedioPago=this.mediopagoForm.value;
              this.mediopagoService.CrearMedioPago(newMediopago).subscribe({
                  next:()=>{
                      this.isEditing=false;
                      this.isNew=false;
                      this.mediopagoForm.reset();
                      this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado' });
                      this.cargarMediosPago();
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
          this.mediopagoForm.reset({ ban01IdTipoPago: '01' });
      }
  
      /*onDelete(mediopago:MedioPago,index:number){
          this.confirmationService.confirm({
              message: `¿Está seguro que desea eliminar el año <b>${mediopago.ban01descripcion}</b>?`,
              header: 'Confirmar Eliminación',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Sí, eliminar',
              rejectLabel: 'No, cancelar',
              acceptButtonStyleClass: 'p-button-danger',
              rejectButtonStyleClass: 'p-button',
              accept:()=>{
                  this.mediopagoService.EliminarMedioPago(mediopago.ban01IdTipoPago,banco.ban01IdBanco).subscribe({
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
      }*/

}
