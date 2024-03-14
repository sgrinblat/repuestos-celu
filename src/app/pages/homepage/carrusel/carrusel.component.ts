import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper, { Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination]);


interface Producto {
  nombre: string;
  precio: number;
  imagenUrl: string;
  sucursal: string;
}


@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})

export class CarruselComponent implements OnInit {

  productos: Producto[] = [
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 192680.81,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Una cosa maravillosa',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Instrumento de precision',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Carcasa re loca',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Amigo del rey',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Algo asi re brillante viste',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'y no se no me preguntes',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    // ...otros productos
  ];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  private initializeCarousel(): void {
    const swiper = new Swiper('.mySwiperCarrusel', {
      slidesPerView: 2,
      spaceBetween: 20,
      // Activa la navegación
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // cuando el ancho de la ventana es <= 500px
        501: {
          slidesPerView: 5,
          spaceBetween: 30
        }
      }
    });
  }
}
