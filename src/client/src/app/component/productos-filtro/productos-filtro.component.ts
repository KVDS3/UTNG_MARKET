import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/agre-producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Productos } from '../../models/productos';
import { Carrito } from '../../models/carrito';

@Component({
  selector: 'app-productos-filtro',
  templateUrl: './productos-filtro.component.html',
  styleUrls: ['./productos-filtro.component.css']
})
export class ProductosFiltroComponent implements OnInit {
  categoria: string = '';
  productosFiltrados: Productos[] = [];
  query: string = '';
  cantidadTotal: number = 0;
  productos: Productos[] = [];
  selectedProduct: Productos | null = null;
  mensaje: string | null = null;
  mensajeVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Obtiene la categoría desde los parámetros de la URL y carga los productos correspondientes.
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria') || '';
      this.obtenerProductosPorCategoria(this.categoria);
    });
  }

  // Obtiene productos de una categoría específica y establece la URL de las imágenes.
  obtenerProductosPorCategoria(categoria: string) {
    this.productosService.getProductos().subscribe((productos: Productos[]) => {
      this.productosFiltrados = productos
        .filter(producto => producto.categoria === categoria)
        .map(producto => ({
          ...producto,
          imagen_url: `http://localhost:3000${producto.imagen_url}`
        }));
    });
  }

  // Muestra un mensaje temporal en la pantalla.
  mostrarMensaje() {
    this.mensajeVisible = true;

    setTimeout(() => {
      this.mensajeVisible = false;
      this.mensaje = null;
    }, 2000);
  }

  // Abre un modal para ver los detalles del producto seleccionado.
  openModal(product: Productos): void {
    this.selectedProduct = product;
    console.log('Modal abierto para el producto:', this.selectedProduct);
  }

  // Cierra el modal.
  closeModal() {
    this.selectedProduct = null;
  }

  // Agrega un producto al carrito, creando o actualizando el carrito según corresponda.
  agregarAlCarrito(producto: Productos): void {
    // Verifica que el producto tenga todos los campos necesarios.
    if (!producto._id || !producto.id_vendedor || !producto.nombre_producto || 
        producto.cantidad_dispo == null || 
        producto.precio == null || 
        !producto.descripcion || 
        !producto.fecha_publicacion || 
        !producto.categoria) {
        console.error('El producto tiene campos faltantes o indefinidos:', producto);
        return; 
    }

    // Crear el item del carrito con la cantidad inicial en 1.
    const carritoItem = {
        id_producto: producto._id,
        id_vendedor: producto.id_vendedor,
        nombre_producto: producto.nombre_producto,
        cantidad_dispo: producto.cantidad_dispo,
        precio: Number(producto.precio),
        descripcion: producto.descripcion,
        fecha_publicacion: new Date(producto.fecha_publicacion),
        categoria: producto.categoria,
        imagen: producto.imagen_url || ''
    };

    console.log('Carrito Item a agregar:', carritoItem);

    // Verifica si ya existe un carrito para el usuario "usuario123".
    this.carritoService.getCarritos().subscribe((carritos: any[]) => {
        const carritoExistente = carritos.find(carrito => carrito.id_usuario === 'usuario123');

        if (carritoExistente) {
            // Si el carrito existe, verifica si el producto ya está en el carrito.
            const productoExistente = carritoExistente.productos.find((item: { id_producto: string; }) => item.id_producto === carritoItem.id_producto);
            if (productoExistente) {
                productoExistente.cantidad_dispo += carritoItem.cantidad_dispo;
                console.log('Cantidad actualizada para el producto existente:', productoExistente);
            } else {
                carritoExistente.productos.push(carritoItem);
                console.log('Producto agregado al carrito existente:', carritoExistente.productos);
            }

            // Actualiza el carrito en el servicio.
            this.carritoService.updateCarrito(carritoExistente).subscribe(
                (response: any) => {
                    console.log('Carrito actualizado con éxito', response);
                    this.mensaje = `${producto.nombre_producto} ha sido agregado al carrito.`;
                    this.mostrarMensaje();
                },
                (error: any) => {
                    console.error('Error al actualizar el carrito', error);
                }
            );
        } else {
            // Si no existe un carrito, crea uno nuevo con el producto.
            const nuevoCarrito = new Carrito('usuario123', 'activo', new Date(), [carritoItem]);
            this.carritoService.createCarrito(nuevoCarrito).subscribe(
                (response: any) => {
                    console.log('Carrito creado y producto agregado', response);
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
}
