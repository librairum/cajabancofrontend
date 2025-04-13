import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { verMensajeInformativo } from 'src/app/demo/components/utilities/funciones_utilitarias';

@Component({
    templateUrl: './filedemo.component.html',
    providers: [MessageService]
})
export class FileDemoComponent {

    uploadedFiles: any[] = [];

    constructor(private messageService: MessageService) {}

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        verMensajeInformativo(this.messageService,'info', 'Success', 'File Uploaded');
    }

    onBasicUpload() {
        verMensajeInformativo(this.messageService,'info', 'Success', 'File Uploaded with Basic Mode');
    }

}
