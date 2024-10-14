import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/agre-producto.service'; // Importa tu servicio
import { Productos } from '../../models/productos'; // Modelo de producto
@Component({
  selector: 'app-agre-producto',
  templateUrl: './agre-producto.component.html',
  styleUrl: './agre-producto.component.css'
})
export class AgreProductoComponent implements OnInit {
  productos: Productos[] = [];
  producto: Productos = new Productos('', '', 0, 0, '', new Date(), ''); // Producto inicial vacío
  editando: boolean = false;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  // Obtener todos los productos
  listarProductos(): void {
    this.productosService.getProductos().subscribe((data: Productos[]) => {
      this.productos = data;
    });
  }

  // Crear o actualizar un producto
  onSubmit(): void {
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

  // Editar producto
  editarProducto(producto: Productos): void {
    this.producto = { ...producto }; // Clonar para editar sin modificar directamente la lista
    this.editando = true;
  }

  // Eliminar producto
  eliminarProducto(_id: string | undefined): void {
    this.productosService.deleteProducto(_id!).subscribe(() => {
      this.listarProductos();
    });
  }

  // Limpiar el formulario
  resetForm(): void {
    this.producto = new Productos('', '', 0, 0, '', new Date(), '');
    this.editando = false;
  }
}
