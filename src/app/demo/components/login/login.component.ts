import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule,CheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    credencialesFRM:FormGroup;
    errorMessage: string = '';

    constructor(private fb:FormBuilder, private lS:LoginService, private router:Router){
        this.credencialesFRM=fb.group({
            Nombre:['',[Validators.required]],
            Clave: ['',[Validators.required]]
        });
    }

    //Método para manejar el envió del form
    iniciarSesion(){
        if(this.credencialesFRM.valid){
            this.lS.inicio_Sesion(this.credencialesFRM.value).subscribe({
                next: (response)=>{
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/Home']);
                },
                error:(err)=>{
                    this.errorMessage='Credenciales Incorrectas'
                }
            })
        } else {
            this.errorMessage='Por favor, completa los campos corrrectamente';
        }
    }
}
