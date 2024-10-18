import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api/productos'; // Cambia por tu URL de la API

  constructor(private http: HttpClient) {}

  // Eliminar un producto por _id
  deleteProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener todos los productos
  getProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl);
  }

  // Crear un nuevo producto con imagen
  createProducto(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData); // Ruta corregida, solo usa apiUrl
  }

  // Actualizar un producto existente con imagen
  updateProducto(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, {
      headers: {
        // No establecer 'Content-Type', el navegador lo maneja automáticamente.
      },
    });
  }
}
