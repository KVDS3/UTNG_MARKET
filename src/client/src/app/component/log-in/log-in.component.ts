import { UsuariosService } from './../../services/usuarios.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;


  constructor(private usuariosService:UsuariosService, private router:Router){}

  // Método para iniciar sesión
  onLogin() {
    this.usuariosService.logInUser({'username':this.username,'password':this.password}).subscribe(
      (res:any)=>{
        const token = res.token;
        // Guardar el token en sessionStorage
        sessionStorage.setItem('token', token);
        // Redirigir a la página de inicio
        this.router.navigate(['/inicio']); // Ajusta la ruta según tu aplicación
      },
      (error:any)=>{
        this.loginError=true;
      }
    )
  }
}
