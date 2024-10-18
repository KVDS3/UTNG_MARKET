import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../models/usuarios';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  // Propiedades para el formulario de usuario
  nombre: string = '';
  correoElectronico: string = '';
  telefono: string = '';
  direccion: string = '';
  rol: string = '';
  fechaRegistro: string = ''; // Lo manejaremos como string para el formulario
  usuarioSeleccionado: Usuarios | null = null;
  userType='student';

  // Almacenar la lista de usuarios
  usuarios: Usuarios[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  // Obtener la lista de usuarios
  getUsuarios(): void {
    this.usuariosService.getUsuarios()
      .subscribe(usuarios => this.usuarios = usuarios);
  }

  // Lógica del formulario para agregar o actualizar usuarios
  onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.nombre && this.correoElectronico && this.telefono && this.direccion && this.rol && this.fechaRegistro) {
      if (this.usuarioSeleccionado) {
        this.actualizarUsuario(this.usuarioSeleccionado);
      } else {
        this.agregarUsuario();
      }
    } else {
      console.error('Por favor, complete todos los campos.');
    }
  }

  // Agregar un nuevo usuario
  agregarUsuario(): void {
    const nuevoUsuario: Usuarios = new Usuarios(this.nombre, this.correoElectronico, this.telefono, this.direccion, this.rol, new Date(this.fechaRegistro));

    this.usuariosService.addUsuario(nuevoUsuario).subscribe(
      (res) => {
        console.log('Usuario agregado correctamente:', res);
        this.limpiarFormulario();
        this.getUsuarios();
      },
      (error) => {
        console.error('Error al agregar el usuario:', error);
      }
    );
  }

  // Actualizar un usuario existente
  actualizarUsuario(usuario: Usuarios): void {
    const usuarioActualizado: Usuarios = new Usuarios(this.nombre, this.correoElectronico, this.telefono, this.direccion, this.rol, new Date(this.fechaRegistro), usuario._id);

    this.usuariosService.updateUsuario(usuarioActualizado).subscribe(
      (res) => {
        console.log('Usuario actualizado correctamente:', res);
        this.limpiarFormulario();
        this.getUsuarios();
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  // Eliminar un usuario
  borrarUsuario(usuarios: Usuarios): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(usuarios._id!).subscribe(
        () => {
          console.log('Usuario eliminado correctamente');
          this.getUsuarios();
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }

  // Cargar los datos del usuario en el formulario para editar
  editarUsuario(usuario: Usuarios): void {
    this.nombre = usuario.nombre;
    this.correoElectronico = usuario.correoElectronico;
    this.telefono = usuario.telefono;
    this.direccion = usuario.direccion;
    this.rol = usuario.rol;
    this.fechaRegistro = usuario.fechaRegistro.toISOString().substring(0, 10); // Formato YYYY-MM-DD para el input de fecha
    this.usuarioSeleccionado = usuario;
  }

  // Limpiar el formulario después de agregar/editar
  limpiarFormulario(): void {
    this.nombre = '';
    this.correoElectronico = '';
    this.telefono = '';
    this.direccion = '';
    this.rol = '';
    this.fechaRegistro = '';
    this.usuarioSeleccionado = null;
  }
}
