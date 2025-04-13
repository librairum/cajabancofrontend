import { MessageService } from "primeng/api";

export function verMensajeInformativo(messageService: MessageService , tipo: string, titulo: string, detalle: string, tiempo_aparicion: number = 3000){
    if(titulo === ''){
        titulo = 'Mensaje Informativo'
    }

    return messageService.add({
        severity: tipo,
        summary: titulo,
        detail: detalle,
        life: tiempo_aparicion
    });
}
