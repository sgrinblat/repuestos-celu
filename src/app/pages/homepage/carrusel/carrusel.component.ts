import { Component, OnInit } from '@angular/core';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

// instala módulos de Swiper
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

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
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'V11111111111111111111',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: '22222222222222222222',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: '33333333333333333333333',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: '5555555555555555555555555555555555555',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: '66666666666666666666666',
      precio: 2222,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: '55555555555555555555444444444444444',
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
  carrusel: any;


  ngOnInit() {
  }
  private scrollJump: number = 200; // Este valor deberás ajustarlo a la anchura de tus tarjetas de producto

  constructor() {}

  next(): void {
    this.carrusel.nativeElement.scrollLeft += this.scrollJump;
  }

  previous(): void {
    this.carrusel.nativeElement.scrollLeft -= this.scrollJump;
  }
}
