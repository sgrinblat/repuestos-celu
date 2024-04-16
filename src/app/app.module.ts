import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SwiperModule } from "swiper/angular";
import { RecaptchaModule, RecaptchaFormsModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReutilizablesModule } from './reutilizables/reutilizables.module';
import { PagesModule } from './pages/pages.module';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NavigationEnd, Router } from '@angular/router';

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
    LazyLoadImageModule,
    PagesModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,

  ],
  providers: [{
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: '6LcefLopAAAAAFN8sPSYSBNigqA22tCUW1O1JC49',
  }],
  bootstrap: [AppComponent]
})



export class AppModule {

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-D3J1EYLZBS', {
          'page_path': event.urlAfterRedirects
        });
      }
    });
  }
}


declare var gtag: any;

