export interface ApiResponse<T> {
    message: string;
    messageException: string | null;
    isSuccess: boolean;
    item: T | null;
    data: T[];
    total: number;
    mensajeRetorno: string | null;
    flagRetorno: number;
}
