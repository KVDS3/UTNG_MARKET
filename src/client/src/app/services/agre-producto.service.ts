import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  // Método para eliminar un producto
  deleteProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting product', error);
        return throwError(error);
      })
    );
  }

  // Método para agregar un producto
  addProducto(formData: FormData): Observable<Productos> {
    return this.http.post<Productos>(this.apiUrl, formData).pipe(
      catchError(error => {
        console.error('Error adding product', error);
        return throwError(error);
      })
    );
  }

  // Método para obtener todos los productos
  getProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching products', error);
        return throwError(error);
      })
    );
  }

  updateProducto(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData).pipe(
        catchError(error => {
            console.error('Error updating product', error);
            return throwError(error);
        })
    );
}
}
