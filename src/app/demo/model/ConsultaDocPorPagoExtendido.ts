// Se creo este modelo para poder juntar los datos de ConsultaDocPorPago y agregar_Pago en uno solo

import { ConsultaDocPorPago } from './ConsultaDocPorPago';
import { agregar_Pago } from './presupuesto';

export interface ConsultaDocPorPagoExtendido extends ConsultaDocPorPago {
    soles?: number;
    dolares?: number;
}
