import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../login/Login';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MensajemodalComponent } from '../../mensajemodal/mensajemodal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [PanelModule,ButtonModule, ReactiveFormsModule, TableModule, InputTextModule, DialogModule, FormsModule,
      ConfirmDialogModule,CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
    usuarios:Usuario[]=[];
    usuarioForm:FormGroup;
    usuarioeditando:boolean = false;
    seleccionarusuario: Usuario | null = null;
    visible_ventana: boolean = false;
    nuevoregistro:boolean = false;

    constructor(private uS:UsuarioService, private fb:FormBuilder){
        this.usuarioForm=this.fb.group({
            Sistema: [null, [Validators.maxLength(10)]],
            Nombre: ['', [Validators.required, Validators.maxLength(8)]],
            Clave: ['', [Validators.required, Validators.maxLength(8)]],
            NombreComp: [null, [Validators.maxLength(40)]],
            Cargo: [null, [Validators.maxLength(20)]],
            AccPerCerr: [null, [Validators.maxLength(1)]],
            Periodo: [null, [Validators.maxLength(8)]],
            Moneda: [null, [Validators.maxLength(1)]],
            Saldos: [null, [Validators.maxLength(1)]],
            TipoImp: [null, [Validators.maxLength(1)]],
            Ajuste: [null, [Validators.maxLength(1)]],
            AccPerCon: [null, [Validators.maxLength(1)]],
            VarImpChe: [null, [Validators.maxLength(1)]],
            CenCosto: [null, [Validators.maxLength(12)]],
            Tipo: [null, [Validators.maxLength(2)]],
            AccArea: [null, [Validators.maxLength(10)]],
        });
    }
 ngOnInit(): void {
    this.cargarUsuarios();
 }

 //listar todos los usuarios
 cargarUsuarios(): void{
    this.uS.listar_usuarios().subscribe((data)=>{
        this.usuarios=data;
    })
 }
 // Método para abrir la ventana de creacion de usuario
 VerCrearRegistro_usuario():void{
    this.usuarioForm.reset();
    this.usuarioeditando=false;
    this.seleccionarusuario=null;
    this.visible_ventana=true;
    this.nuevoregistro=true;
 }
 // metodo para abrir la ventana de edicion
 VerActualizarRegistro_usuario():void{
    if(!this.seleccionarusuario) return;
    this.usuarioForm.patchValue(this.seleccionarusuario);
    this.usuarioeditando=true;
    this.visible_ventana=true;
    this.nuevoregistro=false;
 }
 // registrar o actualizar usuario
 guardar_usuario(): void{
    if(this.usuarioForm.valid){
        const usuario:Usuario=this.usuarioForm.value;
        if (this.usuarioeditando && this.seleccionarusuario){
            this.uS.actualizar_usuario(this.seleccionarusuario.Nombre, usuario).subscribe(()=>{
                this.cargarUsuarios();
                this.visible_ventana=false;
            });
        } else{
            this.uS.crear_usuario(usuario).subscribe(()=>{
                this.cargarUsuarios();
                this.visible_ventana=false;
            });
        }
    }
 }

 // seleeccionar un nombre de usuaario para la edicion
selectusuario(usuario: Usuario):void{
    this.seleccionarusuario=usuario;
}

 // confirmar y elminar usuario (usando un Nombre como clave)
 eliminar_usuario(usuario:Usuario):void{
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.Nombre}?`)) {
        this.uS.eliminar_usuario(usuario.Nombre).subscribe(() => {
          this.cargarUsuarios();
        });
    }
 }

 onFilter(filterValue: string): void {
    if (filterValue) {
      const searchTerm = filterValue.toLowerCase();
      this.usuarios = this.usuarios.filter((usuario) =>
        usuario.Nombre.toLowerCase().includes(searchTerm)
      );
    } else {
      this.cargarUsuarios();
    }
  }


 limpiarForm():void{
    this.usuarioForm.reset();
    this.usuarioeditando=false;
    this.seleccionarusuario=null;
 }
}
