
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule,CheckboxModule,ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {
    credencialesFRM:FormGroup;
    errorMessage: string = '';
    showDialog: boolean = false;
    dialogMessage: string = '';

    constructor(private fb:FormBuilder, private LoginServicio:LoginService, private router:Router, private messageService:MessageService){
        this.credencialesFRM=fb.group({
            Nombre:['',[Validators.required,Validators.maxLength(50)]],
            Clave: ['',[Validators.required,Validators.maxLength(50)]]
        });
    }

    //Método para manejar el envió del form
    iniciarSesion(){
        if(this.credencialesFRM.valid){
            
            this.LoginServicio.InicioSesion(this.credencialesFRM.value.Nombre, 
                this.credencialesFRM.value.Clave,'01').subscribe({
                    next:  ()=>{
                         this.router.navigate(['/Home']);
                        //console.log("Enviado a /home");
                    }, error:(error) =>{
                        this.showToast('error', 'Credenciales invalidas','Usuario y/o clave incorrecta');
                        console.log("Error en inicio de sesio");
                    }
                });
            // this.lS.login(this.credencialesFRM.value).subscribe({
            //     next: ()=>{              
            //         this.router.navigate(['/Home']);
            //     },
            //     error:(error)=>{
            //         console.error('Error en login', error);
            //         this.showToast('error', 'Credenciales inválidas', 'Por favor verifica tus datos.');
            //         this.credencialesFRM.reset()
            //     }
            // })
        } else {
            this.showToast('warn', 'Campos incompletos', 'Por favor completa los campos correctamente.');
        }
    }

    showToast(severity: string, summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail }); // Muestra el toast
      }

}
