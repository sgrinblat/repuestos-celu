import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



import { Page404Component } from './reutilizables/page404/page404.component';

import { PoliticaPrivacidadComponent } from "./reutilizables/politica-privacidad/politica-privacidad.component";
import { HomepageComponent } from "./pages/homepage/homepage.component";
import { FaqComponent } from "./pages/faq/faq.component";
import { NosotrosComponent } from "./pages/nosotros/nosotros.component";



const routes: Routes = [
    {
      path: "",
      component: HomepageComponent,
      pathMatch: "full"
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
