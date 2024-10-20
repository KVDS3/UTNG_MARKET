import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/agre-producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Productos } from '../../models/productos';
import { Carrito } from '../../models/carrito';

@Component({
  selector: 'app-agre-producto',
  templateUrl: './agre-producto.component.html',
  styleUrls: ['./agre-producto.component.css']
})
export class AgreProductoComponent implements OnInit {
  productos: Productos[] = [];
  producto: Productos = new Productos('', '', 0, 0, '', new Date(), '',  );
  editando: boolean = false;
  selectedFile: File | null = null;

  constructor(private productosService: ProductosService, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe((data: Productos[]) => {
      this.productos = data;
    });
  }
 

  onSubmit(): void {
    const formData = new FormData();
    formData.append('id_vendedor', this.producto.id_vendedor);
    formData.append('nombre_producto', this.producto.nombre_producto);
    formData.append('cantidad_dispo', this.producto.cantidad_dispo.toString());
    formData.append('precio', this.producto.precio.toString());
    formData.append('descripcion', this.producto.descripcion);
    formData.append('fecha_publicacion', this.producto.fecha_publicacion.toISOString());
    formData.append('categoria', this.producto.categoria);

    this.productosService.createProducto(formData).subscribe(response => {
      console.log('Producto agregado', response);
      // Resetear el formulario si es necesario
    });
  }
 

  editarProducto(producto: Productos): void {
    this.producto = { ...producto };
    this.editando = true;
  }

  eliminarProducto(id: string | undefined): void {
    if (id) { // Asegurarse de que el id está definido
      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          console.log('Producto eliminado correctamente');
          this.listarProductos(); // Actualizar la lista después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar el producto', err);
        }
      });
    } else {
      console.error('No se puede eliminar el producto: ID no está definido');
    }
  }

  resetForm(): void {
    this.producto = new Productos('', '', 0, 0, '', new Date(), '', null);
    this.editando = false;
  }

  agregarAlCarrito(producto: Productos): void {
    const carritoItem = {
      id_usuario: 'usuario123',
      id_producto: producto._id,
      id_vendedor: producto.id_vendedor,
      nombre_producto: producto.nombre_producto,
      cantidad_dispo: producto.cantidad_dispo,
      precio: producto.precio,
      descripcion: producto.descripcion,
      fecha_publicacion: producto.fecha_publicacion,
      categoria: producto.categoria,
    };

    this.carritoService.addToCarrito(carritoItem).subscribe(
      (response) => {
        console.log('Producto agregado al carrito', response);
      },
      (error) => {
        console.error('Error al agregar al carrito', error);
      }
    );
  }
}
