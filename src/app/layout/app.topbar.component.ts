import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../demo/components/service/app.layout.service";
import { Router } from '@angular/router';
import { GlobalService } from '../demo/service/global.service';
import { LoginService } from '../demo/service/login.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,private link:Router,private gS:GlobalService,private aS:LoginService) {
        this.selectedDate = new Date();
    }

    nombre:string=this.gS.getNombreUsuario();
    selectedDate: Date = new Date();

    onDateSelect(date: Date){
        this.gS.updateSelectedDate(date);
    }



    cerrarSesion(){
        this.aS.logout();
        this.gS.clearSession();
        this.link.navigate(['/Inicio_Sesion']);
    }
}
