import { Component, OnInit, AfterViewInit  } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-bannerhomepage',
  templateUrl: './bannerhomepage.component.html',
  styleUrls: ['./bannerhomepage.component.css']
})
export class BannerhomepageComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    new Swiper('.mySwiperBanner', {
      modules: [Pagination], // Asegúrate de registrar el módulo Pagination si no lo has hecho globalmente
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        // cuando el ancho de la ventana es >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        // cuando el ancho de la ventana es >= 480px
        480: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        // cuando el ancho de la ventana es >= 640px
        640: {
          slidesPerView: 1,
          spaceBetween: 30
        }
      },
      spaceBetween: 5, // Añade espacio entre diapositivas si es necesario
      loop: true, // Permite que el carrusel continúe de manera circular
    });
  }

}
