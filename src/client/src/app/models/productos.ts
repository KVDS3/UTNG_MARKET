export class Productos {
  _id?: string;
  id_vendedor: string;
  nombre_producto: string;
  cantidad_dispo: number;
  precio: number;
  descripcion: string;
  fecha_publicacion: Date;
  categoria: string;
  imagen?: string | null; // La imagen es una cadena (la URL del archivo)

  constructor(
    id_vendedor: string,
    nombre_producto: string,
    cantidad_dispo: number,
    precio: number,
    descripcion: string,
    fecha_publicacion: Date,
    categoria: string,
    imagen?: string | null // Acepta una cadena o null
  ) {
    this.id_vendedor = id_vendedor;
    this.nombre_producto = nombre_producto;
    this.cantidad_dispo = cantidad_dispo;
    this.precio = precio;
    this.descripcion = descripcion;
    this.fecha_publicacion = fecha_publicacion;
    this.categoria = categoria;
    this.imagen = imagen || null; // Inicializar con null si no se pasa
  }
}
