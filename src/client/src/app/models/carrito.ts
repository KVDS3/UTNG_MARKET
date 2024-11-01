export class Carrito {
  _id?: string;
  id_usuario: string;
  estado: string;
  fecha_creacion: Date;
  productos: {
    id_producto: string;
    id_vendedor: string;
    nombre_producto: string;
    cantidad_dispo: number;
    precio: number;
    descripcion: string;
    fecha_publicacion: Date;
    categoria: string;
    imagen?: string; // Propiedad imagen opcional
  }[];

  constructor(id_usuario: string, estado: string, fecha_creacion: Date, productos: any[], _id?: string) {
    this._id = _id;
    this.id_usuario = id_usuario;
    this.estado = estado;
    this.fecha_creacion = fecha_creacion;
    this.productos = productos;
  }
}
