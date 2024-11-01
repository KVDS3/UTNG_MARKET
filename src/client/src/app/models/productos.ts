export class Productos {
  _id?: string;
  id_vendedor: string;
  nombre_producto: string;
  cantidad_dispo: number;
  precio: number;
  descripcion: string;
  fecha_publicacion: Date;
  categoria: string;
  imagen_url?: string;  // Añadir el campo para la URL de la imagen

  constructor(
    id_vendedor: string,
    nombre_producto: string,
    cantidad_dispo: number,
    precio: number,
    descripcion: string,
    fecha_publicacion: Date,
    categoria: string,
    imagen_url?: string  // Incluir en el constructor
  ) {
    this.id_vendedor = id_vendedor;
    this.nombre_producto = nombre_producto;
    this.cantidad_dispo = cantidad_dispo;
    this.precio = precio;
    this.descripcion = descripcion;
    this.fecha_publicacion = fecha_publicacion;
    this.categoria = categoria;
    this.imagen_url = imagen_url;  // Asignar el valor
  }
}
