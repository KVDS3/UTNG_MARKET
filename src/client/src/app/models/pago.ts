// modelo pago.ts
export class Pago {
    id_usuario: string; // ID del usuario
    id_carrito: string; // ID del carrito
    total: number; // Total del pago

    constructor(id_usuario: string, id_carrito: string, total: number) {
        this.id_usuario = id_usuario;
        this.id_carrito = id_carrito;
        this.total = total;
    }
}
