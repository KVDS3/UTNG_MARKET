import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var paypal: any;

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.css']
})
export class FormaPagoComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  productos = {
    descripcion: 'si',
    precio: '0', // Inicialmente a 0 o un valor por defecto
    img: 'img pro'
  };

  private id_usuario = 'usuario123'; // Cambia este valor según el contexto del usuario

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerTotalPagos();
  }

  obtenerTotalPagos(): void {
    // Llama al backend para obtener el total de pagos
    this.http.get<{ total: number }>(`http://localhost:3000/api/pagos/total/${this.id_usuario}`)
      .subscribe({
        next: (response) => {
          // Asigna el total al precio de productos
          this.productos.precio = response.total.toString();
          this.initializePayPal(); // Inicializa PayPal después de obtener el total
        },
        error: (err) => {
          console.error('Error al obtener el total de pagos:', err);
        }
      });
  }

  initializePayPal(): void {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: this.productos.descripcion,
            amount: {
              currency_code: 'MXN',
              value: this.productos.precio
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        try {
          const order = await actions.order.capture();
          console.log(order);
        } catch (error) {
          console.error('Error al capturar la orden', error);
        }
      },
      onError: (err: any) => {
        console.error('Error de PayPal', err);
      }
    }).render(this.paypalElement.nativeElement);
  }
}
