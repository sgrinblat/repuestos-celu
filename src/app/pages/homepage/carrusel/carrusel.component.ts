import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);


@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})

export class CarruselComponent implements OnInit {
  @Input() productos: Producto[];


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  private initializeCarousel(): void {
    const swiper = new Swiper('.mySwiperCarrusel', {
      slidesPerView: 2,
      spaceBetween: 60,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: true,
      breakpoints: {
        501: {
          slidesPerView: 5,
          spaceBetween: 30
        }
      }
    });
  }
}
