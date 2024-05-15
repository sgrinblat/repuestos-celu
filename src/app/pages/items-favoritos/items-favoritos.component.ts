import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { ConexionService } from 'src/app/service/conexion.service';
import { NotificationService } from '../../service/notification.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-items-favoritos',
  templateUrl: './items-favoritos.component.html',
  styleUrls: ['./items-favoritos.component.css']
})
export class ItemsFavoritosComponent implements OnInit {
  productos1: Producto[] = []; // Lista de productos
  sesionIniciada: boolean = false;

  constructor(private conexionService: ConexionService, private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private route: Router,
    private auth: AuthService
    ) { }


  ngOnInit() {

    if(this.auth.sesionIniciada()) {
      console.log("arre");
      this.sesionIniciada = true;
      this.fetchFavoriteProducts();
    } else {
      console.log("dios no");
      this.sesionIniciada = false;
    }

  }

  verProducto(id: number) {
    this.route.navigate(['producto', id]);
  }

  fetchFavoriteProducts() {
    this.conexionService.getFavoriteList().subscribe({
      next: (productos) => {
        this.productos1 = productos;
        console.log(this.productos1);
        this.cdr.detectChanges();  // Forzar la detección de cambios
      },
      error: (error) => {
        console.error('Error fetching favorite products:', error);
      }
    });
  }

  eliminarProducto(productId: number) {
    this.conexionService.quitarProductoFavorito(productId).subscribe({
      next: (response) => {
        console.log('Producto eliminado', response);
        // Luego de añadir a favoritos, fetch el nuevo conteo
        this.notificationService.fetchFavCount();
        this.arrojarToast("Producto eliminado")
        this.fetchFavoriteProducts();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar producto de favoritos', error);
        this.arrojarToast("Error para eliminar el producto")
      }
    });
  }

  eliminarTodo() {
    this.conexionService.eliminarFavoritos().subscribe({
      next: (response) => {
        console.log('Lista vaciada', response);
        this.notificationService.fetchFavCount();
        this.arrojarToast("Lista vaciada")
        this.fetchFavoriteProducts();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar lista', error);
        this.arrojarToast("Error para eliminar el producto")
      }
    });
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
