import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  images;
    responsiveOptions;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  seleccionado: string;

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  mostrarFundamentos() {
    Loading.hourglass();
    Loading.remove(600);
    setTimeout(() => {
      this.seleccionado = "Fundamentos";
    }, 600);
  }

  mostrarExpansionA() {
    Loading.hourglass();
    Loading.remove(600);
    setTimeout(() => {
      this.seleccionado = "ExpansionA";
    }, 600);
  }


}
