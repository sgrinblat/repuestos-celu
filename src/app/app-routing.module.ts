import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



import { Page404Component } from './reutilizables/page404/page404.component';

import { PoliticaPrivacidadComponent } from "./reutilizables/politica-privacidad/politica-privacidad.component";
import { HomepageComponent } from "./pages/homepage/homepage.component";
import { FaqComponent } from "./pages/faq/faq.component";
import { NosotrosComponent } from "./pages/nosotros/nosotros.component";
import { ProductoIndividualComponent } from "./pages/producto-individual/producto-individual.component";
import { ItemsCarritoComponent } from "./pages/items-carrito/items-carrito.component";
import { ItemsFavoritosComponent } from "./pages/items-favoritos/items-favoritos.component";
import { HomeListingComponent } from "./pages/home-listing/home-listing.component";
import { RegistroUsuarioComponent } from "./pages/registro-usuario/registro-usuario.component";



const routes: Routes = [
    {
      path: "",
      component: HomepageComponent,
      pathMatch: "full"
    },
    {
      path: "busqueda",
      component: HomeListingComponent,
    },
    {
      path: "faqs",
      component: FaqComponent,
    },
    {
      path: "nosotros",
      component: NosotrosComponent,
    },
    {
      path: "producto",
      component: ProductoIndividualComponent,
    },
    {
      path: "registro",
      component: RegistroUsuarioComponent,
    },
    {
      path: "carrito",
      component: ItemsCarritoComponent,
    },
    {
      path: "favoritos",
      component: ItemsFavoritosComponent,
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
