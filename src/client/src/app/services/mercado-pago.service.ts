import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private apiUrl = 'http://localhost:3000/api/formaPagos'; // Cambia la URL a la del carrito
  carrito: any;

  constructor(private http: HttpClient) {}

  generarPago() {
    // Aquí envías los productos del carrito al backend para generar la preferencia
    this.http.post('http://localhost:3000/api/mercado-pago', { productos: this.carrito.productos })
      .subscribe((response: any) => {
        // Redirige al usuario a la URL de Mercado Pago
        window.location.href = response.init_point;
      });
  }
}
