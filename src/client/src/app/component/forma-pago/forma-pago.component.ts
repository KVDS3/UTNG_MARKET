import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var paypal: any;

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.css'] // Cambié "styleUrl" por "styleUrls"
})
export class FormaPagoComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef | undefined;

  constructor(private http: HttpClient) {}

  productos = {
    descripcion: 'si',
    precio: '19',
    img: 'img pro'
  }

  ngOnInit(): void {
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              descripcion: this.productos.descripcion,
              amount: {
                currency_code: 'MXN',
                value: this.productos.precio
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          console.log(order);
        },
        onError: (err: any) => {
          console.log(err);
        }
      })
      .render(this.paypalElement?.nativeElement);
  }
}
