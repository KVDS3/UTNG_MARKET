export class Productos {
    _id?: string; // Se genera automáticamente en MongoDB
    id_vendedor: string;
    nombre_producto: string;
    cantidad_dispo: number;
    precio: number;
    descripcion: string;
    fecha_publicacion: Date;
    categoria: string;
  
    constructor(
      id_vendedor: string,
      nombre_producto: string,
      cantidad_dispo: number,
      precio: number,
      descripcion: string,
      fecha_publicacion: Date,
      categoria: string
    ) {
      this.id_vendedor = id_vendedor;
      this.nombre_producto = nombre_producto;
      this.cantidad_dispo = cantidad_dispo;
      this.precio = precio;
      this.descripcion = descripcion;
      this.fecha_publicacion = fecha_publicacion;
      this.categoria = categoria;
    }
}
