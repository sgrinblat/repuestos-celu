import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { AuthService } from 'src/app/service/auth.service';
import { ConexionService } from 'src/app/service/conexion.service';
import { NotificationService } from 'src/app/service/notification.service';
import Swal from 'sweetalert2';

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
    private notificationService: NotificationService,
    private auth: AuthService
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
        Swal.fire('Error', `No se pudo recuperar el producto`, 'error');
      }
    });
  }

  getAvailabilityMessage(available: number): string {
    if (available === 0) {
        return 'Producto agotado';
    } else if (available === 1) {
        return '¡Última unidad!';
    } else if (available < 6) {
        return `¡Quedan solo ${available} unidades!`;
    } else {
        return `${available} unidades disponibles`;
    }
  }

  addToFavorites(productId: number) {
    if(this.auth.sesionIniciada()) {
      this.conexionService.agregarProductoFavorito(productId).subscribe({
        next: (response) => {
          // Luego de añadir a favoritos, fetch el nuevo conteo
          this.notificationService.fetchFavCount();
          this.arrojarToast("Producto agregado")
        },
        error: (error) => {
          this.arrojarToast("El producto ya está en favoritos")
        }
      });
    } else {
      this.arrojarToast("Inicia sesión para agregar un producto a favoritos")
    }
  }

  addToCarrito(productId: number) {
    if(this.auth.sesionIniciada()) {
      this.conexionService.agregarProductoCarrito(productId).subscribe({
        next: (response) => {
          // Luego de añadir a favoritos, fetch el nuevo conteo
          this.notificationService.fetchCartCount();
          this.arrojarToast("Producto agregado")
        },
        error: (error) => {
          this.arrojarToast("El producto ya está en el carrito")
        }
      });
    } else {
      this.arrojarToast("Inicia sesión para agregar un producto al carrito")
    }
  }

  arrojarToast(mensaje: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "info",
      title: mensaje
    });
  }



}
