import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { CarritoComponent } from './component/carrito/carrito.component';
import { AgreProductoComponent } from './component/agre-producto/agre-producto.component';
import { LogInComponent } from './component/log-in/log-in.component';
import { FormaPagoComponent } from './component/forma-pago/forma-pago.component';
import { ConfirmPagoComponent } from './component/confirm-pago/confirm-pago.component';
import { AgreDireccionComponent } from './component/agre-direccion/agre-direccion.component';
import { ProductosInicioComponent } from './component/productos-inicio/productos-inicio.component';
import { ProductosFiltroComponent } from './component/productos-filtro/productos-filtro.component';


const routes: Routes = [
  {
    path : '',
    redirectTo : '/home',
    pathMatch : 'full'
  },
  {
    path:'LogIn',
    component:LogInComponent
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
  },
  {
    path : 'agre_producto',
    component : AgreProductoComponent
  },
  {
    path : 'formaPagos',
    component : FormaPagoComponent
  },
  {
    path : 'confirmPago',
    component : ConfirmPagoComponent
  },
  {
    path : 'Direccion',
    component : AgreDireccionComponent
  },
  {
    path : 'inicio',
    component : ProductosInicioComponent
  },

{
  path : 'productosF',
  component : ProductosFiltroComponent
},
{ path: 'productosF/:categoria',
  component: ProductosFiltroComponent 
} 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
