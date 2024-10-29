import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { PagoService } from '../../services/pago.service'; // Importa el servicio de pago
import { Carrito } from '../../models/carrito';
import { Pago } from '../../models/pago'; // Importa el modelo Pago
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: Carrito | null = null;
  total: number = 0;
  cantidadSeleccionada: { [id_producto: string]: number } = {};
  mensajeEliminacion: boolean = false; // Bandera para mostrar el mensaje
  cargando: boolean = false; // Nueva variable para el estado de carga

  constructor(
    private carritoService: CarritoService,
    private pagoService: PagoService, // Inyecta el servicio de pago
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.getCarritos().subscribe(carritos => {
      if (carritos.length > 0) {
        this.carrito = carritos[0];
        console.log("Carrito cargado:", this.carrito);

        // Inicializa la cantidad para cada producto en 1
        this.carrito.productos.forEach(producto => {
          this.cantidadSeleccionada[producto.id_producto] = 1; // Comienza con 1
        });

        this.calcularTotal();
      } else {
        console.log("No hay carritos disponibles");
      }
    }, error => {
      console.error("Error al obtener el carrito:", error);
    });
  }

  incrementar(id_producto: string) {
    const producto = this.carrito?.productos.find(p => p.id_producto === id_producto);
    
    if (producto && this.cantidadSeleccionada[id_producto] < producto.cantidad_dispo) {
      this.cantidadSeleccionada[id_producto]++;
      this.calcularTotal();
    }
  }

  decrementar(id_producto: string) {
    const producto = this.carrito?.productos.find(p => p.id_producto === id_producto);
    
    if (producto && this.cantidadSeleccionada[id_producto] > 1) {
      this.cantidadSeleccionada[id_producto]--;
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.total = this.carrito?.productos.reduce((sum, producto) => 
      sum + producto.precio * this.cantidadSeleccionada[producto.id_producto], 0) || 0;
  }
 
  eliminarProducto(id_producto: string) {
    if (this.carrito) {
      const index = this.carrito.productos.findIndex(producto => producto.id_producto === id_producto);

      if (index > -1) {
        this.carrito.productos.splice(index, 1);
        
        this.carritoService.updateCarrito(this.carrito).subscribe(() => {
          console.log('Producto eliminado del carrito en la base de datos.');
          this.calcularTotal(); // Recalcula el total

          // Muestra el mensaje de confirmación
          this.mostrarMensajeEliminacion();
        }, error => {
          console.error('Error al actualizar el carrito en la base de datos:', error);
        });
      }
    } else {
      console.log("El carrito no está disponible");
    }
  }

  mostrarMensajeEliminacion() {
    this.mensajeEliminacion = true;
    setTimeout(() => {
      this.mensajeEliminacion = false; // Oculta el mensaje después de 3 segundos
    }, 3000);
  }

  procederAlPago() {
    if (this.carrito) {
      this.cargando = true;
  
      const id_usuario = "usuario123"; // Suponiendo que este es el ID del usuario
      const nuevoPago = new Pago(id_usuario, this.carrito._id || '', this.total);
  
      // Verificar si el pago ya existe
      this.pagoService.verificarPagoExistente(id_usuario, this.carrito._id || '').subscribe(existe => {
        if (existe.length > 0) {
          this.router.navigate(['/confirmPago']);
          console.log('Este pago ya existe en la base de datos.');        
          this.cargando = false; // Detener la animación de carga
          // Aquí puedes mostrar un mensaje al usuario si lo deseas.
        } else {
          // Si no existe, proceder a guardar el nuevo pago
          this.pagoService.guardarPago(nuevoPago).subscribe(() => {
            console.log('Pago guardado exitosamente en la base de datos');
  
            // Simular un tiempo de carga antes de redirigir
            setTimeout(() => {
              this.cargando = false;
              this.router.navigate(['/confirmPago']); // Redirige a la pantalla de confirmación de pago
            }, 2000); // Simula el tiempo de carga (2 segundos)
  
          }, error => {
            console.error('Error al guardar el pago:', error);
            this.cargando = false;
          });
        }
      }, error => {
        console.error('Error al verificar si el pago ya existe:', error);
        this.cargando = false;
      });
    }
  }
  
}
