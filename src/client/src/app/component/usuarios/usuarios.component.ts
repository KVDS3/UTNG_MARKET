import { RfcService } from './../../services/rfc.service';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../models/usuarios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  // Propiedades para el formulario de usuario
  nombre: string = '';
  correoElectronico: string = '';
  telefono: string = '';
  direccion: string = '';
  universidad: string = '';
  areaAcademica: string = '';
  giroComercial: string = '';
  representanteLegal: string = '';
  rol: string = '';
  fechaRegistro: string = ''; // Lo manejaremos como string para el formulario
  rfc: string = '';
  numeroControl: string = '';
  rfcValido: boolean | null = null;
  rfcExiste: boolean | null = null;
  userType: string = 'student'; // Valor por defecto
  username: string = '';
  password: string = '';
  formValid: boolean = false;
  password2: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private rfcService: RfcService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  isVisibleFieldValid(): boolean {
    // Validar campos comunes
    const commonFieldsValid =
      this.nombre != '' &&
      this.correoElectronico != '' &&
      this.telefono != '' &&
      this.direccion != '';

    // Validar campos adicionales según el tipo de usuario
    if (this.rol === 'student') {
      return (
        commonFieldsValid &&
        this.numeroControl != '' &&
        this.universidad != '' &&
        this.areaAcademica != ''
      );
    } else if (this.rol === 'shop') {
      return (
        commonFieldsValid &&
        (this.rfcValido as boolean) &&
        this.giroComercial != '' &&
        this.representanteLegal != ''
      );
    }
    return commonFieldsValid;
  }

  checkForm() {
    if (!this.validateRFC()) {
      return;
    }
    this.formValid = true;
  }

  // Lógica del formulario para registrar usuarios
  onSubmit(event: Event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario
    if (
      this.nombre &&
      this.correoElectronico &&
      this.telefono &&
      this.direccion &&
      this.rol
    ) {
      const userData = {
        nombre: this.nombre,
        correoElectronico: this.correoElectronico,
        telefono: this.telefono,
        direccion: this.direccion,
        tipoUsuario: this.rol, // Cambié 'rol' a 'tipoUsuario' para alinearlo con el backend
        password: this.password, // Asegúrate de manejar la contraseña adecuadamente
        username: this.username,
        estudiante:
          this.rol === 'student'
            ? {
                numeroControl: this.numeroControl,
                universidad: this.universidad,
                areaAcademica: this.areaAcademica,
              }
            : undefined,
        tienda:
          this.rol === 'shop'
            ? {
                rfc: this.rfc,
                giroComercial: this.giroComercial,
                representanteLegal: this.representanteLegal,
              }
            : undefined,
      };
      this.agregarUsuario(userData);
    } else {
      console.error(
        'Por favor, complete todos los campos y asegúrese de que el RFC sea válido.'
      );
    }
  }

  // Agregar un nuevo usuario
  agregarUsuario(nuevoUsuario: any): void {
    if (!this.isVisibleFieldValid()) {
      return;
    }
    this.usuariosService.addUsuario(nuevoUsuario).subscribe(
      (res) => {
        console.log('Usuario agregado correctamente:', res);
        this.limpiarFormulario();
        this.router.navigate(['./LogIn']);
      },
      (error) => {
        console.error('Error al agregar el usuario:', error);
      }
    );
  }

  validated: boolean = false;
  // Validar RFC
  validateRFC() {
    console.log('................');
    const rfcPattern = /^[A-Z0-9]{12}$/;
    this.rfcValido = rfcPattern.test(this.rfc);

    // Implementa tu lógica aquí para verificar si el RFC ya existe
    // Asumiendo que tienes un método que consulta el RFC
    if (this.rfcValido) {
      this.rfcService.getRFC(this.rfc).subscribe(
        (data) => {
          console.log(data['exists']);
          this.rfcExiste = data['exists']; // Ajusta según la estructura de tu respuesta
        },
        (error) => {
          console.error('Error al consultar el RFC:', error);
        }
      );
    }
    this.validated = true;
    return this.rfcExiste;
  }

  // Limpiar el formulario después de agregar
  limpiarFormulario(): void {
    this.nombre = '';
    this.correoElectronico = '';
    this.telefono = '';
    this.direccion = '';
    this.rol = '';
    this.fechaRegistro = '';
    this.rfc = '';
    this.universidad = '';
    this.areaAcademica = '';
    this.giroComercial = '';
    this.representanteLegal = '';
  }

  showPasswordWarning = false;
  showConfirmPasswordWarning = false;

  validatePassword() {
    this.showPasswordWarning = true;
  }

  validateConfirmPassword() {
    this.showConfirmPasswordWarning = true;
  }

  showNombreWarning: boolean = false;
  showCorreoWarning: boolean = false;
  showTelefonoWarning: boolean = false;
  showDireccionWarning: boolean = false;
  showRolWarning: boolean = false;
  showControlNumberWarning: boolean = false;
  showRFCWarning: boolean = false;
  showUsernameWarning: boolean = false;
}
