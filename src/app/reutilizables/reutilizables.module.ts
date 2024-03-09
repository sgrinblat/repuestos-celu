import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SwiperModule } from "swiper/angular";

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { Page404Component } from './page404/page404.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    Page404Component,
    PoliticaPrivacidadComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    Page404Component,
    PoliticaPrivacidadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
  ]
})
export class ReutilizablesModule { }
