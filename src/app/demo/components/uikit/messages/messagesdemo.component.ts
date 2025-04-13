import { Component } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { verMensajeInformativo } from 'src/app/demo/components/utilities/funciones_utilitarias';

@Component({
    templateUrl: './messagesdemo.component.html',
    providers: [MessageService]
})
export class MessagesDemoComponent {

    msgs: Message[] = [];

    constructor(private messageService: MessageService) { }

    showInfoViaToast() {
        verMensajeInformativo(this.messageService,'info', 'Info Message', 'PrimeNG rocks');
    }

    showWarnViaToast() {
        verMensajeInformativo(this.messageService,'warn', 'Warn Message', 'There are unsaved changes');
    }

    showErrorViaToast() {
        verMensajeInformativo(this.messageService,'error', 'Error Message', 'Validation failed');
    }

    showSuccessViaToast() {
        verMensajeInformativo(this.messageService,'success', 'Success Message', 'Message sent');
    }

    showInfoViaMessages() {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
    }

    showWarnViaMessages() {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'There are unsaved changes' });
    }

    showErrorViaMessages() {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
    }

    showSuccessViaMessages() {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success Message', detail: 'Message sent' });
    }

}
