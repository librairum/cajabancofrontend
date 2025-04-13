export function verMensajeInformativo(tipo: string, titulo: string, detalle: string){
    if(titulo === ''){
        titulo = 'Mensaje Informativo'
    }

    return this.messageService.add({
        severity: tipo,
        summary: titulo,
        detail: detalle,
    });
}
