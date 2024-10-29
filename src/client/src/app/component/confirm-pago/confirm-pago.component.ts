import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Carrito } from '../../models/carrito';
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago';

@Component({
  selector: 'app-confirm-pago',
  templateUrl: './confirm-pago.component.html',
  styleUrls: ['./confirm-pago.component.css']
})
export class ConfirmPagoComponent implements OnInit {
  carrito: Carrito | null = null;
  pagos: Pago[] = [];
  total: number = 0;
  isUsuario123: boolean = false; // Nueva propiedad para verificar el usuario

  // Objeto para almacenar la cantidad seleccionada para cada producto
  cantidadSeleccionada: { [id_producto: string]: number } = {};
  producto: any;

  constructor(private carritoService: CarritoService, private pagoService: PagoService) {}

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

      } else {
        console.log("No hay carritos disponibles");
      }
    }, error => {
      console.error("Error al obtener el carrito:", error); // Manejo de errores
    });

    // Obtener pagos y verificar si son solo para el usuario 'usuario123'
    this.pagoService.getPagosByUsuario('usuario123').subscribe(
      (pagos) => {
        this.pagos = pagos;

        // Filtrar pagos solo para 'usuario123'
        const filteredPagos = pagos.filter(pago => pago.id_usuario === 'usuario123');
        
        // Sumar los totales solo si hay pagos válidos
        if (filteredPagos.length > 0) {
          this.total = filteredPagos.reduce((acc, pago) => acc + pago.total, 0);
          this.isUsuario123 = true; // Establece a true si hay pagos para 'usuario123'
        } else {
          this.isUsuario123 = false; // Establece a false si no hay pagos para 'usuario123'
        }
      },
      (error) => {
        console.error('Error al obtener los pagos:', error);
        this.isUsuario123 = false; // Asegúrate de que sea false en caso de error
      }
    );
  }
}
