import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { AuthService } from 'src/app/service/auth.service';
import { ConexionService } from 'src/app/service/conexion.service';
import { NotificationService } from 'src/app/service/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-items-carrito',
  templateUrl: './items-carrito.component.html',
  styleUrls: ['./items-carrito.component.css']
})
export class ItemsCarritoComponent implements OnInit {
  productos1: Producto[] = []; // Lista de productos
  sesionIniciada: boolean = false;

  constructor(private conexionService: ConexionService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private route: Router,
    private auth: AuthService
    ) { }


  ngOnInit() {
    if(this.auth.sesionIniciada()) {
      this.sesionIniciada = true;
      this.fetchCarritoProducts();
    } else {
      this.sesionIniciada = false;
    }
  }

  fetchCarritoProducts() {
    this.conexionService.getCarritoList().subscribe({

      next: (productos) => {
        this.productos1 = productos.map(producto => ({
          ...producto,
          quantity: 1
        }));

        console.log(this.productos1);
        this.calcularTotal();
        this.cdr.detectChanges();  // Forzar la detección de cambios
      },
      error: (error) => {
        console.error('Error fetching carrito products:', error);
      }
    });
  }

  verProducto(id: number) {
    this.route.navigate(['producto', id]);
  }

  convertirPrecio(price: string): number {
    return parseFloat(price) || 0; // Convierte la cadena a flotante, devuelve 0 si la conversión falla
  }

  incrementarCantidad(producto: Producto): void {
    if (producto.quantity < producto.available) {
      producto.quantity++;
      this.calcularTotal();  // Recalcula el total cada vez que la cantidad cambia
    } else {
      alert('No puedes agregar más de este producto debido a la disponibilidad limitada.');
    }
  }

  decrementarCantidad(producto: Producto): void {
    if (producto.quantity > 1) {
      producto.quantity--;
      this.calcularTotal();  // Recalcula el total cada vez que la cantidad cambia
    }
  }

  calcularTotal(): number {
    return this.productos1.reduce((acc, producto) => {
      const precio = this.convertirPrecio(producto.price);
      return acc + (precio * producto.quantity);
    }, 0);
  }

  finalizarOrden() {
    this.route.navigate(["orden/finalizar"])
  }



  eliminarProducto(productId: number) {
    this.conexionService.quitarProductoCarrito(productId).subscribe({
      next: (response) => {
        console.log('Producto eliminado', response);
        // Luego de añadir a favoritos, fetch el nuevo conteo
        this.notificationService.fetchCartCount();
        this.arrojarToast("Producto eliminado")
        this.fetchCarritoProducts();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar producto de carrito', error);
        this.arrojarToast("Error para eliminar el producto")
      }
    });
  }

  eliminarTodo() {
    this.conexionService.eliminarCarrito().subscribe({
      next: (response) => {
        console.log('Lista vaciada', response);
        this.notificationService.fetchCartCount();
        this.arrojarToast("Lista vaciada")
        this.fetchCarritoProducts();
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
