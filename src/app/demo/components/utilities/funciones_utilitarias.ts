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

export interface RespuestaAPIBase<T, I = any> {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: I | null; // Puedes tipar 'item' si conoces su estructura
    data: T; // Puedes tipar esto según la respuesta específica que esperes
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}
