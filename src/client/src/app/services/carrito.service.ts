import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrito } from '../models/carrito'; // Asegúrate de tener el modelo correcto importado

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:3000/api/carrito'; // Cambia la URL a la del carrito
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
  addToCarrito(producto: any): Observable<any> {
    const carritoItem = {
        id_usuario: 'usuario123', // Asegúrate de que el id_usuario sea correcto
        ...producto // Incluye el resto de las propiedades del producto
    };
    return this.http.post(this.apiUrl, carritoItem);
}


  // Eliminar un carrito por _id
deleteCarrito(_id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${_id}`);
}


  getCarritos(): Observable<Carrito[]> {
    return this.http.get<Carrito[]>(this.apiUrl); // Asegúrate de que esta ruta devuelva todos los carritos
  }

  // Crear un nuevo carrito
  createCarrito(carrito: Carrito): Observable<Carrito> {
    return this.http.post<Carrito>(this.apiUrl, carrito);
  }

  // Actualizar un carrito existente
  updateCarrito(carrito: Carrito): Observable<Carrito> {
    return this.http.put<Carrito>(`${this.apiUrl}/${carrito._id}`, carrito); // Usamos _id en lugar de otro campo
  }
  // carrito.service.ts
getCarritoByUser(id_usuario: string): Observable<Carrito | null> {
  return this.http.get<Carrito | null>(`${this.apiUrl}/usuario/${id_usuario}`);
}
obtenerCarrito(): Observable<Carrito> {
  return this.http.get<Carrito>(this.apiUrl);
}
}
