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
      console.log(data);

      data.forEach(item => {
        const productsWithLimitedTitles = item.products.map(product => ({
          ...product,
          title: product.title.length > 42 ? product.title.substring(0, 42) + '...' : product.title
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



}
