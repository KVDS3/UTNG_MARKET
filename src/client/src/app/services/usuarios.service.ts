import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuarios } from '../models/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/api/usuarios'; // Cambia la URL a la correcta

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.apiUrl);
  }

  // Agregar un nuevo usuario
  addUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(this.apiUrl, usuario);
  }

  // Actualizar un usuario existente
  updateUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.put<Usuarios>(`${this.apiUrl}/${usuario._id}`, usuario);
  }

  // Eliminar un usuario
  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
