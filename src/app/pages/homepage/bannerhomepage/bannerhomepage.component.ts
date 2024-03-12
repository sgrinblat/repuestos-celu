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
      spaceBetween: 5, // Añade espacio entre diapositivas si es necesario
      loop: true, // Permite que el carrusel continúe de manera circular
    });
  }

}
