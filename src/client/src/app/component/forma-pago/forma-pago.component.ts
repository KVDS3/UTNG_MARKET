import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrl: './forma-pago.component.css'
})
export class FormaPagoComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Inicializa el SDK de Mercado Pago con tu clave pública
    const mp = new (window as any).MercadoPago('TEST-a34bb4f8-e2b0-447c-8a72-e31ffa215c17'); // Reemplaza con tu clave pública de Mercado Pago

    // Obtener el ID de la preferencia desde el backend
    this.http.get('http://localhost:3000/api/mercado-pago/preferencia').subscribe((response: any) => {
      const preferenceId = response.preferenceId; // Asegúrate de que el backend devuelva el preferenceId

      // Inicializa el checkout usando el ID de la preferencia
      mp.bricks().create('wallet', 'wallet_container', {
        initialization: {
          preferenceId: preferenceId, // Utiliza el preferenceId generado
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
      });
    });
  }
}
 
