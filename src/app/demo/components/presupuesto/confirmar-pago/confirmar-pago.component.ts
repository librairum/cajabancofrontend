import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
@Component({
  selector: 'app-confirmar-pago',
  standalone: true,
  imports: [PanelModule, ToastModule, ButtonModule, InputTextModule, CalendarModule, FileUploadModule],
  templateUrl: './confirmar-pago.component.html',
  styleUrl: './confirmar-pago.component.css'
})
export class ConfirmarPagoComponent {

  uploadFunction() {
    
  }  

}
