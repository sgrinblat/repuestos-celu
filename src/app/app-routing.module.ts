import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MainpageComponent } from "./pages/mainpage/mainpage.component";
import { ExpansionesComponent } from './pages/expansiones/expansiones.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { LoreComponent } from './pages/lore/lore.component';
import { TiendasComponent } from './pages/tiendas/tiendas.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { CartasComponent } from './pages/cartas/cartas.component';
import { RarezasComponent } from './pages/rarezas/rarezas.component';
import { TiposComponent } from './pages/tipos/tipos.component';
import { ActualizarCartaComponent } from './pages/actualizar-carta/actualizar-carta.component';
import { ActualizarExpansionComponent } from './pages/actualizar-expansion/actualizar-expansion.component';
import { ActualizarRarezaComponent } from './pages/actualizar-rareza/actualizar-rareza.component';
import { ActualizarTipoComponent } from './pages/actualizar-tipo/actualizar-tipo.component';
import { AdminGuard } from './service/admin.guard';
import { LoginUsuarioComponent } from './pages/login-usuario/login-usuario.component';
import { ListaEntradasComponent } from './pages/posts/lista-entradas/lista-entradas.component';
import { EntradasComponent } from "./pages/posts/entradas/entradas.component";
import { RedirectGuard } from './redirectGuard';
import { EntradaHistoriaComponent } from './pages/entrada-historia/entrada-historia.component';
import { Page404Component } from './reutilizables/page404/page404.component';
import { SubirTiendasComponent } from "./pages/SubirTienda/subirTiendas.component";
import { ActualizarTiendaComponent } from "./pages/actualizar-tienda/actualizar-tienda.component";
import { DecklistComponent } from './pages/decklist/decklist.component';
import { LoginJugadorComponent } from "./pages/login-jugador/login-jugador.component";
import { RegistroJugadorComponent } from "./pages/registro-jugador/registro-jugador.component";
import { JugadorGuard } from "./service/jugador.guard";
import { DecklistsComponent } from "./pages/decklists/decklists.component";
import { VerifyEmailComponent } from "./pages/VerifyEmailComponent/VerifyEmailComponent.component";
import { ResetPasswordComponent } from "./pages/login-jugador/resetPassword/resetPassword.component";
import { TorneosComponent } from "./pages/torneos/torneos.component";
import { ActualizarJugadorComponent } from "./pages/actualizar-jugador/actualizar-jugador.component";
import { MailingComponent } from "./pages/mailing/mailing.component";
import { CartaOracleComponent } from "./pages/carta-oracle/carta-oracle.component";
import { JuegoOrganizadoComponent } from "./pages/torneos/juego-organizado/juego-organizado.component";
import { RankingLigaComponent } from "./pages/torneos/ranking-liga/ranking-liga.component";
import { RankingAperturaComponent } from "./pages/torneos/ranking-apertura/ranking-apertura.component";
import { MarketingMaterialComponent } from "./pages/marketing-material/marketing-material.component";
import { FolletoComponent } from './pages/tiendas/folleto/folleto.component';
import { PoliticaPrivacidadComponent } from "./reutilizables/politica-privacidad/politica-privacidad.component";
import { CalendarioComponent } from "./pages/calendario/calendario.component";
import { CalendarAdminComponent } from "./pages/calendario/calendarAdmin/calendarAdmin.component";
import { ActualizarEventoComponent } from "./pages/calendario/calendarAdmin/actualizar-evento/actualizar-evento.component";


const routes: Routes = [
    {
      path: "",
      component: MainpageComponent,
      pathMatch: "full"
    },
    {
      path: "productos",
      component: ProductosComponent
    },
    {
      path: "buscador",
      component: BuscadorComponent
    },
    {
      path: `buscador/cartas/:id`,
      component: CartaOracleComponent,
    },
    {
      path: "lore",
      component: LoreComponent
    },
    {
      path: `lore/entrada/:id`,
      component: EntradaHistoriaComponent,
    },
    {
      path: "tiendas",
      component: TiendasComponent
    },
    {
      path: "calendario",
      component: CalendarioComponent
    },
    {
      path: "juego-organizado",
      component: JuegoOrganizadoComponent
    },
    // {
    //   path: "juego-organizado/ranking-liga",
    //   component: RankingLigaComponent
    // },
    // {
    //   path: "juego-organizado/ranking-apertura",
    //   component: RankingAperturaComponent
    // },
    {
      path: "tutorial",
      component: TutorialComponent
    },
    {
      path: "marketing-material",
      component: MarketingMaterialComponent
    },
    {
      path: "seal/products/accesslairen",
      component: FolletoComponent
    },
    {
      path: "noticias",
      component: EntradasComponent
    },
    {
      path: `noticias/:id`,
      component: ListaEntradasComponent
    },
    {
      path: `politica-privacidad`,
      component: PoliticaPrivacidadComponent
    },
    {
      path: `decklists`,
      component: DecklistsComponent,
      canActivate: [JugadorGuard]
    },
    {
      path: `decklist`,
      component: DecklistComponent,
      canActivate: [JugadorGuard]
    },
    {
      path: `decklist/:id`,
      component: DecklistComponent,
      canActivate: [JugadorGuard]
    },
    {
      path: "v1/upload/cartas",
      component: CartasComponent,
      canActivate: [AdminGuard]
    },
    {
      path: "v1/upload/expas",
      component: ExpansionesComponent,
      canActivate: [AdminGuard]
    },
    {
      path: "v1/upload/rarezas",
      component: RarezasComponent,
      canActivate: [AdminGuard]
    },
    {
      path: "v1/upload/tipos",
      component: TiposComponent,
      canActivate: [AdminGuard]
    },
    {
      path: "v1/upload/ranking",
      component: TorneosComponent,
      canActivate: [AdminGuard]
    },
    {
      path: "v1/upload/mailing",
      component: MailingComponent,
      canActivate: [AdminGuard]
    },
    {
      path: "v1/upload/subirTiendas",
      component: SubirTiendasComponent,
      canActivate: [AdminGuard]
    },
    {
      path: "v1/upload/fechas",
      component: CalendarAdminComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/upload/actualizar/carta/:id`,
      component: ActualizarCartaComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/upload/actualizar/fecha/:id`,
      component: ActualizarEventoComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/upload/actualizar/expansion/:id`,
      component: ActualizarExpansionComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/upload/actualizar/rareza/:id`,
      component: ActualizarRarezaComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/upload/actualizar/tipo/:id`,
      component: ActualizarTipoComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/upload/actualizar/jugador/:id`,
      component: ActualizarJugadorComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/upload/actualizar/subirTienda/:id`,
      component: ActualizarTiendaComponent,
      canActivate: [AdminGuard]
    },
    {
      path: `v1/login`,
      component: LoginUsuarioComponent
    },
    {
      path: `iniciarsesion`,
      component: LoginJugadorComponent
    },
    {
      path: `registrarse`,
      component: RegistroJugadorComponent
    },
    {
      path: `verify`,
      component: VerifyEmailComponent
    },
    {
      path: `reset_password`,
      component: ResetPasswordComponent
    },
    {
      path: `reset_password/:token`,
      component: ResetPasswordComponent
    },
    {
      path: `error`,
      component: Page404Component
    },
    {
      path: `**`,
      pathMatch: "full",
      redirectTo: "/error"
    }

]

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })]
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppRoutingModule {}
