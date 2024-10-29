import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/agre-producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Productos } from '../../models/productos';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agre-producto',
  templateUrl: './agre-producto.component.html',
  styleUrls: ['./agre-producto.component.css']
})
export class AgreProductoComponent implements OnInit {
  productos: Productos[] = [];
  producto: Productos = new Productos('', '', 0, 0, '', new Date(), '');
  editando: boolean = false;
  selectedFile: File | null = null;  
  previewUrl: string | ArrayBuffer | null = null;
  errorMessage: string | null = null; // Variable para el mensaje de error

  constructor(private productosService: ProductosService, private carritoService: CarritoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productosService.getProductos().subscribe(
      (data: Productos[]) => {
        this.productos = data.map(producto => ({
          ...producto,
          imagen_url: `http://localhost:3000${producto.imagen_url}`
        }));
        console.log(this.productos);
      },
      error => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
    } else {
      this.previewUrl = null;
    }
  }

  resetFileInput(): void {
    const fileInput: HTMLInputElement = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    // Validar que los campos obligatorios estén llenos
    if (
        !this.producto.nombre_producto || 
        !this.producto.cantidad_dispo || 
        !this.producto.categoria || 
        !this.producto.precio || 
        !this.selectedFile // Agregamos la validación para el archivo de imagen
    ) {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios, incluyendo la imagen.';
        return; // Detener la ejecución si hay campos vacíos
    } else {
        this.errorMessage = null; // Limpiar el mensaje de error si todo está correcto
    }

    const formData = new FormData();
    formData.append('id_vendedor', this.producto.id_vendedor);
    formData.append('nombre_producto', this.producto.nombre_producto);
    formData.append('cantidad_dispo', this.producto.cantidad_dispo.toString());
    formData.append('categoria', this.producto.categoria);
    formData.append('precio', this.producto.precio.toString());
    formData.append('fecha_publicacion', this.producto.fecha_publicacion instanceof Date 
      ? this.producto.fecha_publicacion.toISOString() 
      : new Date(this.producto.fecha_publicacion).toISOString()
    );
    formData.append('descripcion', this.producto.descripcion);
  
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }
  
    if (this.editando && this.producto._id) {
      this.productosService.updateProducto(this.producto._id, formData).subscribe(
        response => {
          console.log('Producto actualizado:', response);
          this.listarProductos();
          this.resetForm();
        },
        error => {
          console.error('Error al actualizar el producto', error);
        }
      );
    } else {
      this.productosService.addProducto(formData).subscribe(
        response => {
          console.log('Producto agregado:', response);
          this.listarProductos();
          this.resetForm();
        },
        error => {
          console.error('Error al agregar producto', error);
        }
      );
    }
}


  resetForm(): void {
    this.producto = new Productos('', '', 0, 0, '', new Date(), '');
    this.editando = false;
    this.selectedFile = null;
    this.previewUrl = null;
    this.resetFileInput();
  }

  editarProducto(producto: Productos): void {
    this.producto = { ...producto };
    this.editando = true;
    this.previewUrl = producto.imagen_url || null;
  }

  eliminarProducto(id: string | undefined): void {
    if (id) {
      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          console.log('Producto eliminado correctamente');
          this.listarProductos();
        },
        error: err => {
          console.error('Error al eliminar el producto', err);
        }
      });
    } else {
      console.error('No se puede eliminar el producto: ID no está definido');
    }
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
      imagen: producto.imagen_url // Asumiendo que tienes esta propiedad en el producto
  }; 

    this.carritoService.addToCarrito(carritoItem).subscribe(
      response => {
        console.log('Producto agregado al carrito', response);
      },
      error => {
        console.error('Error al agregar al carrito', error);
      }
    );
  }
}
