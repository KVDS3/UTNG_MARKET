import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/agre-producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Productos } from '../../models/productos';
import { Router } from '@angular/router';
import { Carrito } from '../../models/carrito';


@Component({
  selector: 'app-productos-inicio',
  templateUrl: './productos-inicio.component.html',
  styleUrls: ['./productos-inicio.component.css']
})
export class ProductosInicioComponent implements OnInit {
  productosFiltrados: Productos[] = [];
  query: string = '';
  cantidadTotal: number = 0;
  productos: Productos[] = [];
  selectedProduct: Productos | null = null; // Variable para el producto seleccionado
  mensaje: string | null = null; // Mensaje de confirmación
  mensajeVisible: boolean = false; // Para controlar la visibilidad del mensaje
  searchMode:boolean = false;
  mostrarSugerencias: boolean = false;

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productosService.getProductos().subscribe(
      (data: Productos[]) => {
        this.productos = data.map(producto => ({
          ...producto,
          imagen_url: `http://localhost:3000${producto.imagen_url}`
        }));
        this.productosFiltrados = this.productos;
      },
      error => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  filtrarProductos(): void {
    if (this.query) {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre_producto.toLowerCase().includes(this.query.toLowerCase())
      );
      this.searchMode=true;
    } else {
      this.productosFiltrados = this.productos;
      this.mostrarSugerencias = false;
      this.searchMode=false;
    }
  }

  selectProducto(producto: Productos): void {
    this.query = producto.nombre_producto;
    this.productosFiltrados = this.productos.filter(
      p => p.nombre_producto.toLowerCase() === producto.nombre_producto.toLowerCase() || p.categoria === producto.categoria
    );

    this.mostrarSugerencias = false;
    this.openModal(producto);
      this.searchMode=false;
    }
  

  openModal(product: Productos): void {
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  agregarAlCarrito(producto: Productos): void {
    if (!producto._id || !producto.id_vendedor || !producto.nombre_producto || 
        producto.cantidad_dispo == null || 
        producto.precio == null || 
        !producto.descripcion || 
        !producto.fecha_publicacion || 
        !producto.categoria) {
        console.error('El producto tiene campos faltantes o indefinidos:', producto);
        return; 
    }

    const carritoItem = {
        id_producto: producto._id,
        id_vendedor: producto.id_vendedor,
        nombre_producto: producto.nombre_producto,
        cantidad_dispo: 1,
        precio: Number(producto.precio),
        descripcion: producto.descripcion,
        fecha_publicacion: new Date(producto.fecha_publicacion),
        categoria: producto.categoria,
        imagen: producto.imagen_url || ''
    };

    this.carritoService.getCarritos().subscribe((carritos: any[]) => {
        const carritoExistente = carritos.find(carrito => carrito.id_usuario === 'usuario123');

        if (carritoExistente) {
            const productoExistente = carritoExistente.productos.find((item: { id_producto: string; }) => item.id_producto === carritoItem.id_producto);
            if (productoExistente) {
                productoExistente.cantidad_dispo += carritoItem.cantidad_dispo;
            } else {
                carritoExistente.productos.push(carritoItem);
            }

            this.carritoService.updateCarrito(carritoExistente).subscribe(
                () => {
                    this.mensaje = `${producto.nombre_producto} ha sido agregado al carrito.`;
                    this.mostrarMensaje();
                },
                (error: any) => {
                    console.error('Error al actualizar el carrito', error);
                }
            );
        } else {
            const nuevoCarrito = new Carrito('usuario123', 'activo', new Date(), [carritoItem]);
            this.carritoService.createCarrito(nuevoCarrito).subscribe(
                () => {
                    this.mensaje = `${producto.nombre_producto} ha sido agregado al carrito.`;
                    this.mostrarMensaje();
                },
                (error: any) => {
                    console.error('Error al crear el carrito', error);
                }
            );
        }
    }, (error: any) => {
        console.error('Error al obtener carritos:', error);
    });
  }

  mostrarMensaje() {
    this.mensajeVisible = true;
    setTimeout(() => {
      this.mensajeVisible = false;
      this.mensaje = null;
    }, 2000);
  }

  irACarrito(): void {
    this.router.navigate(['/carrito']);
  }

  navigateToFilter(categoria: string): void {
    this.router.navigate(['/productosF', categoria]);
  }
}
