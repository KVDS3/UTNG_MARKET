import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/agre-producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Productos } from '../../models/productos';
import { HttpClient } from '@angular/common/http';
import { Carrito } from '../../models/carrito';
import { jwtDecode } from 'jwt-decode';
import { ProductosService } from '../../services/agre-producto.service'; // Importa tu servicio
import { Productos } from '../../models/productos'; // Modelo de producto
@Component({
  selector: 'app-agre-producto',
  templateUrl: './agre-producto.component.html',
  styleUrl: './agre-producto.component.css'
})
export class AgreProductoComponent implements OnInit {
  productos: Productos[] = [];
  productosfiltered: Productos[] = [];
  producto: Productos = new Productos('', '', 0, 0, '', new Date(), '');
  editando: boolean = false;
  selectedFile: File | null = null;  
  previewUrl: string | ArrayBuffer | null = null;
  errorMessage: string | null = null; // Variable para el mensaje de error
  vendedor:string='';
  id_vendedor:string='';
  token: string | null ='';

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.listarProductos();
    this.token =sessionStorage.getItem('token')
    if (this.token) {
      const decodedToken: any = jwtDecode(this.token);
      
      this.id_vendedor=decodedToken.id
      this.vendedor = decodedToken.username; // Asume que el campo vendedor está en el token
      console.log(this.vendedor); // Opcional: Verifica los datos decodificados
    }
    
  }

  // Obtener todos los productos
  listarProductos(): void {
    this.productosService.getProductosByVendedor(this.id_vendedor).subscribe(
      (data: Productos[]) => {
        this.productos = data.map(producto => ({
          ...producto,
          imagen_url: `http://localhost:3000${producto.imagen_url}`
        }));
        console.log(this.productos);
        this.mostrarProductosDisponibles();
      },
      error => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.handleFile(this.selectedFile);
    } else {
      this.previewUrl = null;
    }
  }

  resetFileInput(): void {
    const fileInput: HTMLInputElement = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
=======
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
    console.log(this.id_vendedor)

    const formData = new FormData();
    formData.append('id_vendedor', this.id_vendedor);
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

  editarProducto(producto: Productos): void {
    this.producto = { ...producto };
    this.editando = true;
    this.isFormVisible=true;
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

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Evita que el navegador abra la imagen
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.selectedFile = event.dataTransfer?.files[0] as File;
    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
      this.handleFile(this.selectedFile);
    }
  }
  
  handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  isFormVisible: boolean = false;

  mostrarFormulario(): void {
    this.isFormVisible = true; // Muestra el formulario
    this.editando = false; // Asegúrate de que no esté en modo edición
  }

  cerrarFormulario() {
    this.isFormVisible = false;
  }

  mostrarProductosDisponibles() {
    this.productosfiltered = this.productos.filter(p => p.cantidad_dispo > 0);
  }

  mostrarProductosVendidos() {
    this.productosfiltered = this.productos.filter(p => p.cantidad_dispo === 0);
  }
  
}
