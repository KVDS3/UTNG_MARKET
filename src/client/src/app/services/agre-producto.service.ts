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
  deleteProducto(_id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${_id}`);
  }

  // Obtener todos los productos
  getProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl);
  }

  // Crear un nuevo producto
  createProducto(producto: Productos): Observable<Productos> {
    return this.http.post<Productos>(this.apiUrl, producto);
  }

  getProductosByVendedor(vendedor:string): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl+'/vendedor/'+vendedor).pipe(
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
