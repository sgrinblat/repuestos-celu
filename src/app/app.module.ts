import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SwiperModule } from "swiper/angular";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReutilizablesModule } from './reutilizables/reutilizables.module';
import { PagesModule } from './pages/pages.module';
import { authInterceptorProviders } from './service/auth.interceptor';
import { RedirectGuard } from './redirectGuard';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

registerLocaleData(localeEs);


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    [SweetAlert2Module.forRoot()],
    SwiperModule,
    AppRoutingModule,
    ReutilizablesModule,
    PagesModule,
    NgxGoogleAnalyticsModule.forRoot('G-WVZ0L9PZXQ'),
    NgxGoogleAnalyticsRouterModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,

  ],
  providers: [authInterceptorProviders, RedirectGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
