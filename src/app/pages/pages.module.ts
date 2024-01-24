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
import { DragDropModule } from '@angular/cdk/drag-drop';

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
import { DecklistsComponent } from './decklists/decklists.component';
import { VerifyEmailComponent } from './VerifyEmailComponent/VerifyEmailComponent.component';
import { ResetPasswordComponent } from './login-jugador/resetPassword/resetPassword.component';
import { TorneosComponent } from './torneos/torneos.component';
import { ActualizarJugadorComponent } from './actualizar-jugador/actualizar-jugador.component';
import { AdminnavbarComponent } from './adminnavbar/adminnavbar.component';
import { MailingComponent } from './mailing/mailing.component';
import { OrderByPipe } from '../order-by.pipe';
import { CartaOracleComponent } from './carta-oracle/carta-oracle.component';
import { PactoSecretoComponent } from './productos/pacto-secreto/pacto-secreto.component';
import { PlaymatsComponent } from './productos/playmats/playmats.component';
import { ImageGeneratorComponent } from './decklist/image-generator/image-generator.component';
import { ImageBovedaDeckComponent } from './decklist/image-boveda-deck/image-boveda-deck.component';
import { ImageSidedeckComponent } from './decklist/image-sidedeck/image-sidedeck.component';
import { RankingLigaComponent } from './torneos/ranking-liga/ranking-liga.component';
import { RankingAperturaComponent } from './torneos/ranking-apertura/ranking-apertura.component';
import { JuegoOrganizadoComponent } from './torneos/juego-organizado/juego-organizado.component';
import { EntradasDecklistsJugadoresComponent } from './torneos/entradas-decklists-jugadores/entradas-decklists-jugadores.component';
import { EntradasFechasTorneoComponent } from './torneos/entradas-fechas-torneo/entradas-fechas-torneo.component';
import { MarketingMaterialComponent } from './marketing-material/marketing-material.component';
import { FolletoComponent } from './tiendas/folleto/folleto.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CalendarAdminComponent } from './calendario/calendarAdmin/calendarAdmin.component';
import { ActualizarEventoComponent } from './calendario/calendarAdmin/actualizar-evento/actualizar-evento.component';

@NgModule({
  declarations: [
    MainpageComponent,
    BuscadorComponent,
    CartasComponent,
    CartaOracleComponent,
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
    ActualizarJugadorComponent,
    ActualizarEventoComponent,
    LoginUsuarioComponent,
    ResetPasswordComponent,
    LoginJugadorComponent,
    MailingComponent,
    AdminnavbarComponent,
    RegistroJugadorComponent,
    VerifyEmailComponent,
    EntradasComponent,
    ListaEntradasComponent,
    TorneosComponent,
    MarketingMaterialComponent,
    FolletoComponent,
    RankingLigaComponent,
    RankingAperturaComponent,
    JuegoOrganizadoComponent,
    DecklistComponent,
    DecklistsComponent,
    EntradasDecklistsJugadoresComponent,
    EntradasFechasTorneoComponent,
    ImageGeneratorComponent,
    ImageBovedaDeckComponent,
    ImageSidedeckComponent,
    EntradaHistoriaComponent,
    FundamentosComponent,
    CalendarioComponent,
    CalendarAdminComponent,
    PactoSecretoComponent,
    PlaymatsComponent,
    ExpansionAComponent,
    OrderByPipe
  ],
  exports: [
    MainpageComponent,
    BuscadorComponent,
    CartasComponent,
    CartaOracleComponent,
    ExpansionesComponent,
    LoreComponent,
    ProductosComponent,
    RarezasComponent,
    TiendasComponent,
    TiposComponent,
    SubirTiendasComponent,
    TutorialComponent,
    MailingComponent,
    AdminnavbarComponent,
    ActualizarCartaComponent,
    ActualizarExpansionComponent,
    ActualizarRarezaComponent,
    ActualizarTipoComponent,
    ActualizarTiendaComponent,
    ActualizarJugadorComponent,
    ActualizarEventoComponent,
    LoginUsuarioComponent,
    ResetPasswordComponent,
    LoginJugadorComponent,
    RegistroJugadorComponent,
    VerifyEmailComponent,
    EntradasComponent,
    EntradaHistoriaComponent,
    ListaEntradasComponent,
    TorneosComponent,
    MarketingMaterialComponent,
    FolletoComponent,
    RankingLigaComponent,
    CalendarioComponent,
    CalendarAdminComponent,
    RankingAperturaComponent,
    JuegoOrganizadoComponent,
    EntradasDecklistsJugadoresComponent,
    EntradasFechasTorneoComponent,
    DecklistComponent,
    DecklistsComponent,
    ImageGeneratorComponent,
    ImageBovedaDeckComponent,
    ImageSidedeckComponent,
    ExpansionAComponent,
    FundamentosComponent,
    PactoSecretoComponent,
    PlaymatsComponent,
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
    DragDropModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class PagesModule { }

