import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { CarritoComponent } from './component/carrito/carrito.component';
import { AgreProductoComponent } from './component/agre-producto/agre-producto.component';
import { LogInComponent } from './component/log-in/log-in.component';
import { FormaPagoComponent } from './component/forma-pago/forma-pago.component';
import { ConfirmPagoComponent } from './component/confirm-pago/confirm-pago.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgreDireccionComponent } from './component/agre-direccion/agre-direccion.component';
import { ProductosInicioComponent } from './component/productos-inicio/productos-inicio.component';

@NgModule({
  declarations: [
    CarritoComponent,
    HomeComponent,
    UsuariosComponent,
    AppComponent,
    AgreProductoComponent,
    LogInComponent,
    FormaPagoComponent,
    ConfirmPagoComponent,
    AgreDireccionComponent,
    ProductosInicioComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
