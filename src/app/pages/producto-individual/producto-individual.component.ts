import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { ConexionService } from 'src/app/service/conexion.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-producto-individual',
  templateUrl: './producto-individual.component.html',
  styleUrls: ['./producto-individual.component.css']
})
export class ProductoIndividualComponent implements OnInit {
  product: Producto;

  constructor(
    private conexionService: ConexionService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id']; // Asumiendo que la ruta es algo como '/products/:id'
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(productId: number) {
    this.conexionService.getProductById(productId).subscribe(data => {
      if (data.status) {
        this.product = data.product;
      } else {
        console.error('No se pudo cargar los detalles del producto');
      }
    });
  }

  addToCart() {
    // Lógica para añadir al carrito...
    let newCount = 5; // Este valor debe ser dinámico basado en tu lógica
    this.notificationService.updateCartCount(newCount);
  }

  addToFavorites(productId: number) {
    this.conexionService.agregarProductoFavorito(productId).subscribe({
      next: (response) => {
        console.log('Producto agregado a favoritos', response);
        // Luego de añadir a favoritos, fetch el nuevo conteo
        this.notificationService.fetchFavCount();
      },
      error: (error) => {
        console.error('Error al añadir producto a favoritos', error);
      }
    });
  }

}
