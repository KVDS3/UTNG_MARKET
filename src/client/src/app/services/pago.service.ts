// pago.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../models/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'http://localhost:3000/api/pagos'; // Ajusta la URL según tu configuración de backend

  constructor(private http: HttpClient) {}

  guardarPago(pago: Pago): Observable<any> {
    return this.http.post(this.apiUrl, pago);
  }
  verificarPagoExistente(id_usuario: string, idCarrito: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id_usuario=${id_usuario}&idCarrito=${idCarrito}`);
  }
  getPagosByUsuario(id_usuario: string): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}?id_usuario=${id_usuario}`);
  }
  actualizarPago(id: string, nuevoTotal: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { total: nuevoTotal });
}
  
  
}
