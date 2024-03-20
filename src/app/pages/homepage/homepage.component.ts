import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  productos1: Producto[] = [
    {
      nombre: 'Vidrio Lente De Cámara Trasera Para Samsung...',
      precio: 192680.81,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Funda samsung S20',
      precio: 39989.99,
      imagenUrl: 'https://acdn.mitiendanube.com/stores/078/254/products/funda-antigolpe-samsung-galaxy-a33-5g-gel-transparente-con-esquinas-reforzadas-0b90ee5f264dbde4b116969663336765-1024-1024.jpg',
      sucursal: 'SUCURSAL SAN JUAN'
    },
    {
      nombre: 'Repuesto de lente Huawei',
      precio: 6999,
      imagenUrl: 'https://http2.mlstatic.com/D_NQ_NP_881479-MLA31634525843_072019-O.webp',
      sucursal: 'SUCURSAL BUENOS AIRES'
    },
    {
      nombre: 'Carcasa Flip 5',
      precio: 16499.49,
      imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8S9BWhhURz_jkzwfkf8NMIkTCaBDEkvN2nAiq8qR6EQ&s',
      sucursal: 'SUCURSAL SANTA FE'
    },
    {
      nombre: 'Carcasa Kyocera',
      precio: 87499,
      imagenUrl: 'https://http2.mlstatic.com/D_NQ_NP_812653-MLA48451994488_122021-O.webp',
      sucursal: 'SUCURSAL RIO NEGRO'
    },
    {
      nombre: 'Repuesto de pantalla',
      precio: 21630,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Repuesto de pantalla',
      precio: 2222,
      imagenUrl: 'https://www.zetzun.com/rb-media/gallery/note-9s-9pro-lcd.png',
      sucursal: 'SUCURSAL SANTA FE'
    },
    {
      nombre: 'Repuesto de pantalla',
      precio: 2222,
      imagenUrl: 'https://www.zetzun.com/rb-media/gallery/note-9s-9pro-lcd.png',
      sucursal: 'SUCURSAL RIO NEGRO'
    }
    // ...otros productos
  ];

  productos2: Producto[] = [
    {
      nombre: 'Probando otra cosa',
      precio: 5400.81,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Funda samsung S20',
      precio: 39989.99,
      imagenUrl: 'https://acdn.mitiendanube.com/stores/078/254/products/funda-antigolpe-samsung-galaxy-a33-5g-gel-transparente-con-esquinas-reforzadas-0b90ee5f264dbde4b116969663336765-1024-1024.jpg',
      sucursal: 'SUCURSAL SAN JUAN'
    },
    {
      nombre: 'Repuesto de lente Huawei',
      precio: 6999,
      imagenUrl: 'https://http2.mlstatic.com/D_NQ_NP_881479-MLA31634525843_072019-O.webp',
      sucursal: 'SUCURSAL BUENOS AIRES'
    },
    {
      nombre: 'Carcasa Flip 5',
      precio: 16499.49,
      imagenUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8S9BWhhURz_jkzwfkf8NMIkTCaBDEkvN2nAiq8qR6EQ&s',
      sucursal: 'SUCURSAL SANTA FE'
    },
    {
      nombre: 'Carcasa Kyocera',
      precio: 87499,
      imagenUrl: 'https://http2.mlstatic.com/D_NQ_NP_812653-MLA48451994488_122021-O.webp',
      sucursal: 'SUCURSAL RIO NEGRO'
    },
    {
      nombre: 'Repuesto de pantalla',
      precio: 21630,
      imagenUrl: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      sucursal: 'SUCURSAL CÓRDOBA'
    },
    {
      nombre: 'Repuesto de pantalla',
      precio: 2222,
      imagenUrl: 'https://www.zetzun.com/rb-media/gallery/note-9s-9pro-lcd.png',
      sucursal: 'SUCURSAL SANTA FE'
    },
    {
      nombre: 'Repuesto de pantalla',
      precio: 2222,
      imagenUrl: 'https://www.zetzun.com/rb-media/gallery/note-9s-9pro-lcd.png',
      sucursal: 'SUCURSAL RIO NEGRO'
    }
    // ...otros productos
  ];

}
