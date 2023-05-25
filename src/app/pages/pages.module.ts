import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SwiperModule } from "swiper/angular";
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { MainpageComponent } from './mainpage/mainpage.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { CartasComponent } from './cartas/cartas.component';
import { ExpansionesComponent } from './expansiones/expansiones.component';
import { LoreComponent } from './lore/lore.component';
import { ProductosComponent } from './productos/productos.component';
import { RarezasComponent } from './rarezas/rarezas.component';
import { TiendasComponent } from './tiendas/tiendas.component';
import { TiposComponent } from './tipos/tipos.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { ActualizarCartaComponent } from './actualizar-carta/actualizar-carta.component';
import { ActualizarExpansionComponent } from './actualizar-expansion/actualizar-expansion.component';
import { ActualizarRarezaComponent } from './actualizar-rareza/actualizar-rareza.component';
import { ActualizarTipoComponent } from './actualizar-tipo/actualizar-tipo.component';
import { LoginUsuarioComponent } from './login-usuario/login-usuario.component';
import { EntradasComponent } from './posts/entradas/entradas.component';
import { ListaEntradasComponent } from './posts/lista-entradas/lista-entradas.component';
import { EntradaHistoriaComponent } from './entrada-historia/entrada-historia.component';
import { FundamentosComponent } from './productos/fundamentos/fundamentos.component';
import { ExpansionAComponent } from './productos/expansionA/expansionA.component';
import { ReutilizablesModule } from '../reutilizables/reutilizables.module';
import { SubirTiendasComponent } from './SubirTienda/subirTiendas.component';
import { ActualizarTiendaComponent } from './actualizar-tienda/actualizar-tienda.component';
import { DecklistComponent } from './decklist/decklist.component';
import { LoginJugadorComponent } from './login-jugador/login-jugador.component';
import { RegistroJugadorComponent } from './registro-jugador/registro-jugador.component';

@NgModule({
  declarations: [
    MainpageComponent,
    BuscadorComponent,
    CartasComponent,
    ExpansionesComponent,
    LoreComponent,
    ProductosComponent,
    RarezasComponent,
    TiendasComponent,
    TiposComponent,
    SubirTiendasComponent,
    TutorialComponent,
    ActualizarCartaComponent,
    ActualizarExpansionComponent,
    ActualizarRarezaComponent,
    ActualizarTipoComponent,
    ActualizarTiendaComponent,
    LoginUsuarioComponent,
    LoginJugadorComponent,
    RegistroJugadorComponent,
    EntradasComponent,
    ListaEntradasComponent,
    DecklistComponent,
    EntradaHistoriaComponent,
    FundamentosComponent,
    ExpansionAComponent
  ],
  exports: [
    MainpageComponent,
    BuscadorComponent,
    CartasComponent,
    ExpansionesComponent,
    LoreComponent,
    ProductosComponent,
    RarezasComponent,
    TiendasComponent,
    TiposComponent,
    SubirTiendasComponent,
    TutorialComponent,
    ActualizarCartaComponent,
    ActualizarExpansionComponent,
    ActualizarRarezaComponent,
    ActualizarTipoComponent,
    ActualizarTiendaComponent,
    LoginUsuarioComponent,
    LoginJugadorComponent,
    RegistroJugadorComponent,
    EntradasComponent,
    EntradaHistoriaComponent,
    ListaEntradasComponent,
    DecklistComponent,
    ExpansionAComponent,
    FundamentosComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    [SweetAlert2Module],
    SwiperModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ReutilizablesModule,
    LazyLoadImageModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class PagesModule { }

