import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrito } from '../models/carrito'; // Asegúrate de tener el modelo correcto importado

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:3000/api/carrito'; // Cambia la URL a la del carrito

  constructor(private http: HttpClient) {}

  // Agregar un producto al carrito
  addToCarrito(carritoItem: any): Observable<any> {
    return this.http.post(this.apiUrl, carritoItem); // Aquí se corrigió la URL
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
}
