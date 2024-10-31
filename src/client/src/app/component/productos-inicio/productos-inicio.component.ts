import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/agre-producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Productos } from '../../models/productos';
import { Carrito } from '../../models/carrito';
import { Router } from '@angular/router';

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

  constructor(private productosService: ProductosService, private carritoService: CarritoService,private router: Router) { }

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
        this.productosFiltrados = this.productos; // Inicializamos productosFiltrados con todos los productos
        console.log(this.productos);
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
    } else {
      this.productosFiltrados = this.productos;
    }
  }

  openModal(product: Productos): void {
    this.selectedProduct = product; // Asigna el producto seleccionado a la variable selectedProduct
  }

  closeModal() {
    this.selectedProduct = null; // Esto asegura que el modal se oculte
  }
  
  agregarAlCarrito(producto: Productos): void {
    // Verificación de campos en el producto
    if (!producto._id || !producto.id_vendedor || !producto.nombre_producto || 
        producto.cantidad_dispo == null || 
        producto.precio == null || 
        !producto.descripcion || 
        !producto.fecha_publicacion || 
        !producto.categoria) {
        console.error('El producto tiene campos faltantes o indefinidos:', producto);
        return; // Detener si hay campos faltantes
    }

    // Crear el objeto del producto para el carrito
    const carritoItem = {
        id_producto: producto._id,
        id_vendedor: producto.id_vendedor,
        nombre_producto: producto.nombre_producto,
        cantidad_dispo: producto.cantidad_dispo, // Inicializar con 1 al agregar
        precio: Number(producto.precio), // Asegúrate de que sea un número
        descripcion: producto.descripcion,
        fecha_publicacion: new Date(producto.fecha_publicacion), // Convertir a fecha
        categoria: producto.categoria,
        imagen: producto.imagen_url || '' // Asignar imagen_url o cadena vacía si no existe
    };

    console.log('Carrito Item a agregar:', carritoItem); // Verificar el objeto antes de enviarlo

    // Obtener el carrito existente del usuario
    this.carritoService.getCarritos().subscribe(carritos => {
        const carritoExistente = carritos.find(carrito => carrito.id_usuario === 'usuario123');

        if (carritoExistente) {
            // Comprobar si el producto ya existe en el carrito
            const productoExistente = carritoExistente.productos.find(item => item.id_producto === carritoItem.id_producto);

            if (productoExistente) {
                // Si el producto ya está en el carrito, actualizar su cantidad
                productoExistente.cantidad_dispo += carritoItem.cantidad_dispo;
                console.log('Cantidad actualizada para el producto existente:', productoExistente);
            } else {
                // Si el producto no existe, agregarlo al carrito
                carritoExistente.productos.push(carritoItem);
                console.log('Producto agregado al carrito existente:', carritoExistente.productos);
            }

            // Actualizar el carrito existente
            this.carritoService.updateCarrito(carritoExistente).subscribe(
                response => {
                    console.log('Carrito actualizado con éxito', response);
                    this.mensaje = `${producto.nombre_producto} ha sido agregado al carrito.`;
                    this.mostrarMensaje(); // Mostrar el mensaje
                },
                error => {
                    console.error('Error al actualizar el carrito', error);
                }
            );
        } else {
            // Crear un nuevo carrito si no existe
            const nuevoCarrito = new Carrito(
                'usuario123',
                'activo',
                new Date(),
                [carritoItem] // Agregar el nuevo producto
            );

            this.carritoService.createCarrito(nuevoCarrito).subscribe(
                response => {
                    console.log('Carrito creado y producto agregado', response);
                    this.mensaje = `${producto.nombre_producto} ha sido agregado al carrito.`;
                    this.mostrarMensaje(); // Mostrar el mensaje
                },
                error => {
                    console.error('Error al crear el carrito', error);
                }
            );
        }
    }, error => {
        console.error('Error al obtener carritos:', error);
    });
  }

  // Método para mostrar el mensaje y ocultarlo después de un tiempo
  mostrarMensaje() {
    this.mensajeVisible = true; // Mostrar el mensaje

    setTimeout(() => {
      this.mensajeVisible = false; // Ocultar el mensaje después de 2 segundos
      this.mensaje = null; // Limpiar el mensaje
    }, 2000); // Duración del mensaje
  }
  irACarrito(): void {
    this.router.navigate(['/carrito']); // Reemplaza '/ruta-del-carrito' con la ruta correspondiente
  }
}
