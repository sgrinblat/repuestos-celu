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


import { ReutilizablesModule } from '../reutilizables/reutilizables.module';

import { OrderByPipe } from '../order-by.pipe';
import { HomepageComponent } from './homepage/homepage.component';
import { CarruselComponent } from './homepage/carrusel/carrusel.component';
import { BannerhomepageComponent } from './homepage/bannerhomepage/bannerhomepage.component';


@NgModule({
  declarations: [
    HomepageComponent,
    CarruselComponent,
    BannerhomepageComponent
  ],
  exports: [
    HomepageComponent,
    CarruselComponent,
    BannerhomepageComponent
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

