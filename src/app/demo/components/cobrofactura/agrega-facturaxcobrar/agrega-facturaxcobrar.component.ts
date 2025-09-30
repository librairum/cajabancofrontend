
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { GlobalService } from 'src/app/demo/service/global.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { verMensajeInformativo } from 'src/app/demo/components/utilities/funciones_utilitarias';
import { ConfigService } from 'src/app/demo/service/config.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-agrega-facturaxcobrar',
  standalone: true,
  imports: [ FormsModule,
          ReactiveFormsModule,          
          ToastModule,
          PanelModule,          
          TableModule,
          CommonModule,
          ButtonModule,
          RouterModule,          
          InputTextModule,ConfirmDialogModule ],
  templateUrl: './agrega-facturaxcobrar.component.html',
  styleUrl: './agrega-facturaxcobrar.component.css'
})
export class AgregaFacturaxcobrarComponent implements OnInit {
filtroFRM: FormGroup;
items: any[] = [];
loading: boolean = false;

constructor(
        private link: Router,
        private primeng: PrimeNGConfig,
        private fb: FormBuilder,
        private globalService: GlobalService,        
        private confirmationService: ConfirmationService,
        private router: Router,        
        private messageService: MessageService,
        private datePipe: DatePipe,
        private configService: ConfigService
    ) {
        /*const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
            const state = navigation.extras.state as any;
            this.numeropresupuestoMod = state.pagonro;
            this.fechapresupuestoMod = state.fechaformateada;
        } else {
            this.router.navigate(['Home/detalle-presupuesto']);
        }*/

        this.filtroFRM = fb.group({
            empresa: ['', [Validators.required]],
            ruc: ['', [Validators.required]],
            nrodoc: ['', [Validators.required]],
        });
    }
    ngOnInit(): void {
      this.filtroFRM.reset();
    }

}
