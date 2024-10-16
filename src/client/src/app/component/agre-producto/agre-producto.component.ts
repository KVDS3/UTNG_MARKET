import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/agre-producto.service';
import { CarritoService } from '../../services/carrito.service'; // Importa tu nuevo servicio
import { Productos } from '../../models/productos';
import { Carrito } from '../../models/carrito'; // Modelo de carrito

@Component({
  selector: 'app-agre-producto',
  templateUrl: './agre-producto.component.html',
  styleUrls: ['./agre-producto.component.css'] // Corrige 'styleUrl' a 'styleUrls'
})
export class AgreProductoComponent implements OnInit {
  productos: Productos[] = [];
  producto: Productos = new Productos('', '', 0, 0, '', new Date(), '');
  editando: boolean = false;

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
    if (!this.editando) {
      // Establecer la fecha de publicación al crear un producto
      this.producto.fecha_publicacion = new Date();
    }
  
    if (this.editando) {
      this.productosService.updateProducto(this.producto).subscribe(() => {
        this.listarProductos();
        this.resetForm();
      });
    } else {
      this.productosService.createProducto(this.producto).subscribe(() => {
        this.listarProductos();
        this.resetForm();
      });
    }
  }
  

  editarProducto(producto: Productos): void {
    this.producto = { ...producto };
    this.editando = true;
  }

  eliminarProducto(_id: string | undefined): void {
    this.productosService.deleteProducto(_id!).subscribe(() => {
      this.listarProductos();
    });
  }

  resetForm(): void {
    this.producto = new Productos('', '', 0, 0, '', new Date(), '');
    this.editando = false;
  }

  agregarAlCarrito(producto: Productos): void {
    const carritoItem = {
        id_usuario: 'usuario123', // Cambia esto por el ID del usuario real
        id_producto: producto._id,
        id_vendedor: producto.id_vendedor,
        nombre_producto: producto.nombre_producto,
        cantidad_dispo: producto.cantidad_dispo,
        precio: producto.precio,
        descripcion: producto.descripcion,
        fecha_publicacion: producto.fecha_publicacion,
        categoria: producto.categoria
    };

    this.carritoService.addToCarrito(carritoItem).subscribe(
        (response) => {
            console.log('Producto agregado al carrito', response);
            // Aquí puedes agregar un mensaje de éxito o lógica adicional
        },
        (error) => {
            console.error('Error al agregar al carrito', error);
            // Manejo de errores
        }
    );
}
}
