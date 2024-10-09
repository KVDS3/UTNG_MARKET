import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { CarritoComponent } from './component/carrito/carrito.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : '/home',
    pathMatch : 'full'
  },

  {
    path : 'home',
    component : HomeComponent
  },
  {
    path : 'usuarios',
    component : UsuariosComponent
  },
  {
    path : 'carrito',
    component : CarritoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
