import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DetraccionMasiva} from '../../model/DetraccionMasiva';
import { DetraccionService } from '../../service/detraccion.service';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { GlobalService } from '../../service/global.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-detraccion-masiva',
  standalone: true,
  imports: [ToastModule,TableModule,ReactiveFormsModule, CommonModule, ButtonModule,  ],
  templateUrl: './detraccion-masiva.component.html',
  styleUrl: './detraccion-masiva.component.css',
  providers:[MessageService, ConfirmationService]
})
export class DetraccionMasivaComponent implements OnInit {
detraccionMasivaList: DetraccionMasiva[] = [];
rowsPerPage : number = 10;

//item para breadcrumb
items: any[] = [];

  constructor(private detraccionMasivaService: DetraccionService,
    private bs:BreadcrumbService, private globalService:GlobalService,
    private router:Router
  )
  {
    
  }
  ngOnInit(): void {
    this.bs.setBreadcrumbs([
      {icon:'pi pi-home', routerLink:'/Home'},
      {label:'Detraccion masiva', routerLink:'/Home/detraccionmasiva'}
    ]);

    this.bs.currentBreadcrumbs$.subscribe(bs=>{
      this.items = bs;
    })

  }

}
