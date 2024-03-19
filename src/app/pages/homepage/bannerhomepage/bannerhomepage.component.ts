import { Component, OnInit, AfterViewInit } from '@angular/core';
// Importa Swiper core y los componentes necesarios
import SwiperCore, { Autoplay, Pagination, Navigation, Swiper } from 'swiper';

// Instala los módulos de Swiper
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-bannerhomepage',
  templateUrl: './bannerhomepage.component.html',
  styleUrls: ['./bannerhomepage.component.css']
})
export class BannerhomepageComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    new Swiper('.mySwiperBanner', {
      modules: [Pagination],
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
      autoplay: {
        delay: 2000,
        disableOnInteraction: false, // Continúa el autoplay después de que el usuario interactúe con el Swiper
      },
      spaceBetween: 5, // Añade espacio entre diapositivas si es necesario
      loop: true, // Permite que el carrusel continúe de manera circular
    });
  }

}
