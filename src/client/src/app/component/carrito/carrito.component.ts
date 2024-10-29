import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Carrito } from '../../models/carrito';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: Carrito | null = null;
  total: number = 0;

  // Objeto para almacenar la cantidad seleccionada para cada producto
  cantidadSeleccionada: { [id_producto: string]: number } = {};

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    // Obtener todos los carritos
    this.carritoService.getCarritos().subscribe(carritos => {
      if (carritos.length > 0) {
        this.carrito = carritos[0]; // Asegúrate de que hay al menos un carrito
        console.log("Carrito:", this.carrito); // Verifica el contenido del carrito

        // Inicializa la cantidad para cada producto en 1
        this.carrito.productos.forEach(producto => {
          this.cantidadSeleccionada[producto.id_producto] = 1;
        });

        this.calcularTotal();
      } else {
        console.log("No hay carritos disponibles");
      }
    }, error => {
      console.error("Error al obtener el carrito:", error); // Manejo de errores
    });
  }

  incrementar(producto: any) {
    if (this.cantidadSeleccionada[producto.id_producto] < producto.cantidad_dispo) {
      this.cantidadSeleccionada[producto.id_producto]++;
      this.calcularTotal();
    }
  }

  decrementar(producto: any) {
    if (this.cantidadSeleccionada[producto.id_producto] > 1) {
      this.cantidadSeleccionada[producto.id_producto]--;
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.total = this.carrito?.productos.reduce((sum, producto) => 
      sum + producto.precio * this.cantidadSeleccionada[producto.id_producto], 0) || 0;
  }
}