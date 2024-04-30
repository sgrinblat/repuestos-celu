import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { ConexionService } from 'src/app/service/conexion.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  ofertas = [];
  accesorios = [];
  repuestos = [];
  destacados = [];
  esCelular: boolean = false;

  constructor(private conexionService: ConexionService) { }

  ngOnInit() {
    const width = window.innerWidth;

    if (width < 768) {
      // Función para dispositivos móviles
      this.esCelular = true;
    } else {
      // Función para dispositivos no móviles
      this.esCelular = false;
    }

    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.conexionService.getProductsCarrusel().subscribe(data => {
      data.forEach(item => {
        const productsWithLimitedTitles = item.products.map(product => ({
          ...product,
          title: product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title
        }));

        // Mezclar productos aleatoriamente
        const shuffledProducts = this.shuffleArray(productsWithLimitedTitles);

        switch (item.title) {
          case 'Ofertas':
            this.ofertas = shuffledProducts;
            break;
          case 'Accesorios':
            this.accesorios = shuffledProducts;
            break;
          case 'Repuestos':
            this.repuestos = shuffledProducts;
            break;
          case 'Podria interesarte':
            this.destacados = shuffledProducts;
            break;
          default:
            console.log('Categoría no reconocida:', item.title);
        }
      });
      console.log('Ofertas:', this.ofertas);
      console.log('Accesorios:', this.accesorios);
      console.log('Repuestos:', this.repuestos);
      console.log('Destacados:', this.destacados);
    }, error => {
      console.error('Error al obtener los productos del carrusel:', error);
    });
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // intercambio de elementos
    }
    return array;
  }


  productos2: Producto[] = [
    {
      id: 1,
      title: 'Probando otra cosa',
      price: 5400.81,
      image: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      state: 'state CÓRDOBA',
      city: 'state CÓRDOBA'
    },
    {
      id: 1,
      title: 'Funda samsung S20',
      price: 39989.99,
      image: 'https://acdn.mitiendanube.com/stores/078/254/products/funda-antigolpe-samsung-galaxy-a33-5g-gel-transparente-con-esquinas-reforzadas-0b90ee5f264dbde4b116969663336765-1024-1024.jpg',
      state: 'state SAN JUAN',
      city: 'state CÓRDOBA'
    },
    {
      id: 1,
      title: 'Repuesto de lente Huawei',
      price: 6999,
      image: 'https://http2.mlstatic.com/D_NQ_NP_881479-MLA31634525843_072019-O.webp',
      state: 'state BUENOS AIRES',
      city: 'state CÓRDOBA'
    },
    {
      id: 1,
      title: 'Carcasa Flip 5',
      price: 16499.49,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8S9BWhhURz_jkzwfkf8NMIkTCaBDEkvN2nAiq8qR6EQ&s',
      state: 'state SANTA FE',
      city: 'state CÓRDOBA'
    },
    {
      id: 1,
      title: 'Carcasa Kyocera',
      price: 87499,
      image: 'https://http2.mlstatic.com/D_NQ_NP_812653-MLA48451994488_122021-O.webp',
      state: 'state RIO NEGRO',
      city: 'state CÓRDOBA'
    },
    {
      id: 1,
      title: 'Repuesto de pantalla',
      price: 21630,
      image: 'https://definicion.de/wp-content/uploads/2009/06/producto.png',
      state: 'state CÓRDOBA',
      city: 'state CÓRDOBA'
    },
    {
      id: 1,
      title: 'Repuesto de pantalla',
      price: 2222,
      image: 'https://www.zetzun.com/rb-media/gallery/note-9s-9pro-lcd.png',
      state: 'state SANTA FE',
      city: 'state CÓRDOBA'
    },
    {
      id: 1,
      title: 'Repuesto de pantalla',
      price: 2222,
      image: 'https://www.zetzun.com/rb-media/gallery/note-9s-9pro-lcd.png',
      state: 'state RIO NEGRO',
      city: 'state CÓRDOBA'
    }
    // ...otros productos
  ];


}
